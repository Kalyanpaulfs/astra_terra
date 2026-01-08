'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';

interface PropertyMeta {
  cities: Record<number, string>;
  regions: Record<number, string>;
  propertyTypes: string[];
}

function PropertiesSearchContent() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [meta, setMeta] = useState<PropertyMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch metadata
        const metaResponse = await fetch('/api/properties?action=meta');
        const metaData = await metaResponse.json();
        setMeta(metaData);

        // Build query params
        const params = new URLSearchParams();
        const city = searchParams.get('city');
        const type = searchParams.get('type');
        const min = searchParams.get('min');
        const max = searchParams.get('max');
        const listtype = searchParams.get('listtype');
        const regionId = searchParams.get('regionId');

        if (city) params.set('city', city);
        if (type) params.set('type', type);
        if (min) params.set('min', min);
        if (max) params.set('max', max);
        if (listtype) params.set('listtype', listtype);
        if (regionId) params.set('regionId', regionId);
        params.set('size', '24');

        // Fetch properties
        const listingsResponse = await fetch(`/api/properties?${params.toString()}`);
        const listingsData = await listingsResponse.json();
        setListings(listingsData.listings || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  if (loading || !meta) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '200px' }}>Loading...</div>;
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '200px' }}>
        <SearchBar cities={meta.cities} propertyTypes={meta.propertyTypes} />
      </div>
      <section className="py-6 container">
        {listings.length > 0 ? (
          <>
            <h2 className="mb-4 has-text-weight-semibold">
              {listings.length} propert{listings.length > 1 ? 'ies' : 'y'} found
            </h2>
            <div className="atp-container" style={{ flexDirection: 'column' }}>
              {listings.map((listing, idx) => (
                <PropertyCard key={idx} listing={listing} variant="horizontal" />
              ))}
            </div>
          </>
        ) : (
          <p>No properties matched your filters.</p>
        )}
      </section>
    </>
  );
}

export default function PropertiesSearchPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', marginTop: '200px' }}>Loading...</div>}>
      <PropertiesSearchContent />
    </Suspense>
  );
}

