const PIXXI_API_URL = process.env.PIXXI_API_URL || 'https://dataapi.pixxicrm.ae/pixxiapi/v1/properties/Astra Terra Properties L.L.C';
const CACHE_DURATION = 3600; // 1 hour in seconds

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();

function getCached(key: string) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION * 1000) {
        return cached.data;
    }
    return null;
}

function setCache(key: string, data: any) {
    cache.set(key, { data, timestamp: Date.now() });
}

export interface PropertyMeta {
    cities: Record<number, string>;
    regions: Record<number, string>;
    propertyTypes: string[];
}

export async function getMetadata(): Promise<PropertyMeta> {
    // Opt out of static caching for this function if needed, or rely on internal caching logic
    // noStore(); 

    const cacheKey = 'pixxi.meta';
    const cached = getCached(cacheKey);
    if (cached) {
        return cached;
    }

    const token = process.env.PIXXI_TOKEN;
    if (!token) {
        throw new Error('PIXXI_TOKEN is not configured');
    }

    try {
        const response = await fetch(PIXXI_API_URL, {
            method: 'POST',
            headers: {
                'X-PIXXI-TOKEN': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ size: 1000, status: 'ACTIVE' }),
            // Allow static generation with ISR; rely primarily on our in-memory cache
            next: { revalidate: CACHE_DURATION },
        });

        if (!response.ok) {
            // Fallback or throw
            throw new Error(`Failed to fetch metadata: ${response.statusText}`);
        }

        const data = await response.json();
        const listings = data?.data?.list || [];

        const cities: Record<number, string> = {};
        const regions: Record<number, string> = {};
        const propertyTypes = new Set<string>();

        listings.forEach((listing: any) => {
            if (listing.cityId && listing.cityName) {
                cities[listing.cityId] = listing.cityName;
            }
            if (listing.regionId && listing.region) {
                regions[listing.regionId] = listing.region;
            }
            if (listing.propertyType && Array.isArray(listing.propertyType)) {
                listing.propertyType.forEach((type: string) => propertyTypes.add(type));
            }
        });

        const meta = {
            cities: Object.fromEntries(Object.entries(cities).sort()),
            regions: Object.fromEntries(Object.entries(regions).sort()),
            propertyTypes: Array.from(propertyTypes).sort(),
        };

        setCache(cacheKey, meta);
        return meta;
    } catch (error) {
        console.error('Error fetching metadata:', error);
        // Return empty fallback
        return { cities: {}, regions: {}, propertyTypes: [] };
    }
}

interface ListingsFilter {
    size?: number;
    cityIds?: number[];
    propertyType?: string[];
    startPrice?: number;
    endPrice?: number;
    listingType?: string;
    regionIds?: number[];
}



function normalizeProperty(listing: any) {
    let lat = null;
    let lng = null;

    // Check various params for position
    // Prioritize newParam > sellParam > rentParam
    const param = listing.newParam || listing.sellParam || listing.rentParam;

    if (param && param.position) {
        const parts = param.position.split(',');
        if (parts.length === 2) {
            const parsedLat = parseFloat(parts[0]);
            const parsedLng = parseFloat(parts[1]);
            if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
                lat = parsedLat;
                lng = parsedLng;
            }
        }
    }

    return {
        ...listing,
        latitude: lat,
        longitude: lng
    };
}

export async function getListings(filter: ListingsFilter = { size: 12 }) {
    const token = process.env.PIXXI_TOKEN;
    if (!token) {
        throw new Error('PIXXI_TOKEN is not configured');
    }

    try {
        const payload = {
            ...filter,
            status: 'ACTIVE',
        };

        const response = await fetch(PIXXI_API_URL, {
            method: 'POST',
            headers: {
                'X-PIXXI-TOKEN': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            // Enable ISR-friendly caching so functions can run during static generation
            next: { revalidate: CACHE_DURATION },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch listings: ${response.statusText}`);
        }

        const data = await response.json();
        const list = data?.data?.list || [];
        return list.map(normalizeProperty);
    } catch (error) {
        console.error('Error fetching listings:', error);
        return [];
    }
}

export async function getProperty(id: string, debug = false) {
    const logs: string[] = [];
    const log = (msg: string) => { console.log(msg); if (debug) logs.push(msg); };

    const token = process.env.PIXXI_TOKEN;
    log(`[API] getProperty called for ID: ${id}. Token present: ${!!token}`);
    if (!token) {
        throw new Error('PIXXI_TOKEN is not configured');
    }

    try {
        log(`[API] Fetching property with ID: ${id}`);

        // Strategy 1: Attempt to filter by ID or Reference Number
        // We try to pass both if possible, or intelligently choose.
        let payload: any = {
            size: 1,
            status: 'ACTIVE'
        };

        // If it looks like a numeric ID, pass it as 'id' (and 'referenceNumber' just in case)
        // If it's a string ref, pass 'referenceNumber'
        // We add 'id' parameter which many endpoints support.
        if (!isNaN(Number(id))) {
            const numericId = parseInt(id);
            log(`[API DEBUG] Converted ID ${id} to integer ${numericId}`);
            payload.id = numericId;
        } else {
            log(`[API DEBUG] ID ${id} is not numeric, using referenceNumber`);
            payload.referenceNumber = id;
        }

        let response = await fetch(PIXXI_API_URL, {
            method: 'POST',
            headers: {
                'X-PIXXI-TOKEN': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            next: { revalidate: CACHE_DURATION },
        });

        if (!response.ok) throw new Error("Failed to fetch property by filter");

        let data = await response.json();
        let list = data?.data?.list || [];

        if (list.length > 0) {
            const exactMatch = list.find((p: any) => String(p.id) === String(id) || p.referenceNumber === id || String(p.propertyId) === String(id));
            if (exactMatch) {
                log(`[API DEBUG] Found exact match in initial fetch: ${exactMatch.title}`);
                const normalized = normalizeProperty(exactMatch);
                return debug ? { data: normalized, logs } : normalized;
            }
            log(`[API DEBUG] Initial fetch returned ${list.length} items but NO exact match for ID ${id}`);
            // If API returned items but not exact match (weird), fall through to batch
        }

        // Strategy 2: Fetch a larger batch (2000) to find the item
        log(`[API] Filtering failed. Fetching batch of 2000 with cache check.`);

        const BATCH_CACHE_KEY = 'BATCH_2000_ACTIVE';
        list = []; // Re-initialize list for this strategy
        const cachedBatch = getCached(BATCH_CACHE_KEY);

        if (cachedBatch) {
            log(`[API] Using cached batch.`);
            list = cachedBatch;
        } else {
            payload = {
                size: 2000,
                status: 'ACTIVE'
            };

            response = await fetch(PIXXI_API_URL, {
                method: 'POST',
                headers: {
                    'X-PIXXI-TOKEN': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                next: { revalidate: CACHE_DURATION },
            });

            if (!response.ok) throw new Error("Failed to fetch batch");

            data = await response.json();
            list = data?.data?.list || [];

            // Cache this heavy payload for 1 hour (reuse existing duration)
            setCache(BATCH_CACHE_KEY, list);
        }

        // Find by ID match
        const found = list.find((item: any) => String(item.id) === id || item.referenceNumber === id || String(item.propertyId) === id);

        if (found) {
            log(`[API] Found property in batch: ${found.title}`);
            const normalized = normalizeProperty(found);
            return debug ? { data: normalized, logs } : normalized;
        }

        log(`[API] Property ${id} not found in top 100 active listings.`);

        // DEBUG: Log the first item to see structure
        if (list.length > 0) {
            log(`[API DEBUG] FAILED SEARCH - First item keys: ${Object.keys(list[0]).join(', ')}`);
            // Log valuable fields to debug ID/Ref mismatch
            log(`[API DEBUG] FAILED SEARCH - First item ID/Ref/PropId: id=${list[0].id}, ref=${list[0].referenceNumber}, propId=${list[0].propertyId}`);

            // Check if we can find it manually in the list to see if logic is wrong
            const manualCheck = list.find((p: any) => String(p.id) == String(id) || String(p.propertyId) == String(id));
            log(`[API DEBUG] Manual string check for ID ${id} in batch result: ${manualCheck ? 'FOUND' : 'NOT FOUND'}`);
        }

        return debug ? { data: null, logs } : null;

    } catch (error) {
        log(`Error fetching property: ${error}`);
        return debug ? { data: null, logs } : null;
    }
}
