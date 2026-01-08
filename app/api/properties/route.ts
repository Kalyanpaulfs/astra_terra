import { NextRequest, NextResponse } from 'next/server';

const PIXXI_API_URL = 'https://dataapi.pixxicrm.ae/pixxiapi/v1/properties/Astra Terra Properties L.L.C';
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
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'list';
    
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
          'X-PIXXI-TOKEN': process.env.PIXXI_TOKEN || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size: 1000, status: 'ACTIVE' }),
      });

      if (!response.ok) {
        throw new Error('Pixxi API error');
      }

      const data = await response.json();
      const listings = data?.data?.list || [];

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
        'X-PIXXI-TOKEN': process.env.PIXXI_TOKEN || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch properties' },
        { status: response.status }
      );
    }

    const data = await response.json();
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

