import { unstable_noStore as noStore } from 'next/cache';

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
            next: { revalidate: 3600 } // Next.js cache revalidation
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
            next: { revalidate: 60 } // Revalidate every minute
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch listings: ${response.statusText}`);
        }

        const data = await response.json();
        return data?.data?.list || [];
    } catch (error) {
        console.error('Error fetching listings:', error);
        return [];
    }
}
