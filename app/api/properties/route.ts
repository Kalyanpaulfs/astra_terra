import { NextRequest, NextResponse } from 'next/server';

// Try both endpoint formats - with and without company name
const PIXXI_API_URL = process.env.PIXXI_API_URL || 'https://dataapi.pixxicrm.ae/pixxiapi/v1/properties/Astra Terra Properties L.L.C';
const CACHE_DURATION = 3600; // 1 hour in seconds

// Simple in-memory cache (in production, use Redis or similar)
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

// GET /api/properties - Get featured properties (home page)
export async function GET(request: NextRequest) {
  try {
    // Use the standard URL API instead of request.nextUrl to avoid
    // Next.js DynamicServerError during static generation.
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'list';

    // Check if token is configured
    const token = process.env.PIXXI_TOKEN;
    if (!token) {
      console.error('PIXXI_TOKEN is not configured');
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    if (action === 'meta') {
      // Get metadata (cities, regions, property types)
      const cacheKey = 'pixxi.meta';
      const cached = getCached(cacheKey);
      if (cached) {
        return NextResponse.json(cached);
      }

      const response = await fetch(PIXXI_API_URL, {
        method: 'POST',
        headers: {
          'X-PIXXI-TOKEN': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size: 1000, status: 'ACTIVE' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Pixxi API error:', response.status, errorText);
        return NextResponse.json(
          { error: 'Failed to fetch metadata', details: errorText },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log('Pixxi API response structure:', JSON.stringify(data).substring(0, 200));

      const listings = data?.data?.list || [];

      if (listings.length > 0) {
        console.log("FIRST LISTING KEYS:", Object.keys(listings[0]));
        console.log("FIRST LISTING SAMPLE:", JSON.stringify(listings[0], null, 2));
      }

      // Extract cities
      const cities: Record<number, string> = {};
      listings.forEach((listing: any) => {
        if (listing.cityId && listing.cityName) {
          cities[listing.cityId] = listing.cityName;
        }
      });

      // Extract regions
      const regions: Record<number, string> = {};
      listings.forEach((listing: any) => {
        if (listing.regionId && listing.region) {
          regions[listing.regionId] = listing.region;
        }
      });

      // Extract property types
      const propertyTypes = new Set<string>();
      listings.forEach((listing: any) => {
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
      return NextResponse.json(meta);
    }

    if (action === 'developers') {
      // Get developers with property counts
      const cacheKey = 'pixxi.developers';
      const cached = getCached(cacheKey);
      if (cached) {
        return NextResponse.json(cached);
      }

      const response = await fetch(PIXXI_API_URL, {
        method: 'POST',
        headers: {
          'X-PIXXI-TOKEN': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size: 1000, status: 'ACTIVE' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Pixxi API error:', response.status, errorText);
        return NextResponse.json(
          { error: 'Failed to fetch developers', details: errorText },
          { status: response.status }
        );
      }

      const data = await response.json();
      const listings = data?.data?.list || [];

      // Log first listing to see developer field names
      if (listings.length > 0) {
        console.log('[DEVELOPERS] First listing developer fields:', {
          developer: listings[0].developer,
          developerName: listings[0].developerName,
          developerLogo: listings[0].developerLogo,
          listingType: listings[0].listingType,
        });
      }

      // Extract developers and count properties by type
      const developerMap = new Map<string, { name: string; logo: string; counts: { new: number; sell: number; rent: number } }>();

      listings.forEach((listing: any) => {
        // Try different possible field names for developer
        const developerName = listing.developer || listing.developerName || listing.developerCompany || '';
        const developerLogo = listing.developerLogo || listing.developerImage || '';
        const listingType = (listing.listingType || '').toUpperCase();

        if (!developerName) return;

        if (!developerMap.has(developerName)) {
          developerMap.set(developerName, {
            name: developerName,
            logo: developerLogo,
            counts: { new: 0, sell: 0, rent: 0 }
          });
        }

        const dev = developerMap.get(developerName)!;

        // Update logo if we find one and don't have one yet
        if (developerLogo && !dev.logo) {
          dev.logo = developerLogo;
        }

        // Count by listing type
        if (listingType === 'NEW' || listingType === 'OFF_PLAN') {
          dev.counts.new++;
        } else if (listingType === 'SELL' || listingType === 'SALE') {
          dev.counts.sell++;
        } else if (listingType === 'RENT') {
          dev.counts.rent++;
        }
      });

      // Convert to array and sort by total properties
      const developers = Array.from(developerMap.values())
        .sort((a, b) => {
          const totalA = a.counts.new + a.counts.sell + a.counts.rent;
          const totalB = b.counts.new + b.counts.sell + b.counts.rent;
          return totalB - totalA;
        });

      setCache(cacheKey, { developers });
      return NextResponse.json({ developers });
    }

    // Get property listings
    const city = searchParams.get('city');
    const type = searchParams.get('type');
    const min = searchParams.get('min');
    const max = searchParams.get('max');
    const listtype = searchParams.get('listtype');
    const regionId = searchParams.get('regionId');
    const size = searchParams.get('size') || '12';

    const payload: any = {
      size: parseInt(size),
      status: 'ACTIVE',
    };

    if (city) {
      payload.cityIds = [parseInt(city)];
    }

    if (type) {
      payload.propertyType = [type];
    }

    if (min) {
      payload.startPrice = parseInt(min);
    }

    if (max) {
      payload.endPrice = parseInt(max);
    }

    if (listtype) {
      payload.listingType = listtype;
    }

    if (regionId) {
      payload.regionIds = [parseInt(regionId)];
    }

    const response = await fetch(PIXXI_API_URL, {
      method: 'POST',
      headers: {
        'X-PIXXI-TOKEN': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pixxi API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch properties', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Pixxi API response structure:', JSON.stringify(data).substring(0, 200));

    // PHP uses: $response->json('data.list')
    // This means response structure is: { data: { list: [...] } }
    const listings = data?.data?.list || [];

    return NextResponse.json({ listings });
  } catch (error: any) {
    console.error('Properties API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

