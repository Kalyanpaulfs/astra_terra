'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
      setLoading(true);
      try {
        // Fetch metadata
        if (!meta) {
          const metaResponse = await fetch('/api/properties?action=meta');
          if (metaResponse.ok) {
            const metaData = await metaResponse.json();
            setMeta(metaData);
          }
        }

        // Build query params
        const params = new URLSearchParams();
        const city = searchParams.get('city');
        const type = searchParams.get('type');
        const min = searchParams.get('min');
        const max = searchParams.get('max');
        const listtype = searchParams.get('listtype');
        const regionId = searchParams.get('regionId');
        const developer = searchParams.get('developer');

        if (city) params.set('city', city);
        if (type) params.set('type', type);
        if (min) params.set('min', min);
        if (max) params.set('max', max);
        if (listtype) params.set('listtype', listtype);
        if (regionId) params.set('regionId', regionId);
        if (developer) params.set('developer', developer);
        // Increase size to show all properties (or a large batch) as requested
        params.set('size', '100');

        // Fetch properties
        const listingsResponse = await fetch(`/api/properties?${params.toString()}`);
        if (!listingsResponse.ok) {
          const errorData = await listingsResponse.json();
          console.error('Error fetching listings:', errorData);
          throw new Error(errorData.error || 'Failed to fetch listings');
        }
        const listingsData = await listingsResponse.json();
        setListings(listingsData.listings || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays on error so UI doesn't break
        setMeta({ cities: {}, regions: {}, propertyTypes: [] });
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  if (!meta && loading) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader is-loading"></div>
      </div>
    );
  }

  return (
    <section className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        {listings.length > 0 ? (
          <>
            <div className="mb-6 has-text-centered">
              <h1 className="title is-2 has-text-weight-bold mb-3" style={{ color: '#C5A265', fontFamily: '"Playfair Display", serif' }}>
                {searchParams.get('developer')
                  ? `Properties by ${searchParams.get('developer')}`
                  : (searchParams.get('listtype') === 'RENT' ? 'Properties for Rent' : 'Properties for Sale')}
              </h1>

              {searchParams.get('type') && (
                <h2 className="title is-4 mb-4" style={{
                  color: '#0D1625',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  display: 'inline-block',
                  position: 'relative',
                  paddingBottom: '12px'
                }}>
                  {searchParams.get('type')}
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '3px',
                    backgroundColor: '#C5A265'
                  }}></span>
                </h2>
              )}

              <div className="is-flex is-justify-content-center is-align-items-center mt-4">
                <div style={{
                  backgroundColor: '#f5f5f5',
                  padding: '8px 20px',
                  borderRadius: '50px',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ color: '#0D1625', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Total Found</span>
                  <span style={{ display: 'block', width: '1px', height: '16px', backgroundColor: '#ccc' }}></span>
                  <span style={{ color: '#C5A265', fontSize: '14px', fontWeight: 800 }}>
                    {loading ? '...' : `${listings.length} Listings`}
                  </span>
                </div>
              </div>
            </div>

            <div className="at-properties-grid">
              {loading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} style={{
                    height: '480px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    animation: 'pulse 1.5s infinite ease-in-out'
                  }}></div>
                ))
              ) : listings.length > 0 ? (
                listings.map((listing, idx) => (
                  <div key={idx}>
                    <PropertyCard listing={listing} variant="grid" />
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', padding: '60px 0', textAlign: 'center' }}>
                  <div style={{
                    display: 'inline-flex',
                    marginBottom: '1.5rem',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'rgba(197, 162, 101, 0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(197, 162, 101, 0.3)'
                  }}>
                    <i className="ph ph-house" style={{ fontSize: '28px', color: '#C5A265' }}></i>
                  </div>
                  <h3 className="title is-4" style={{ color: '#ffffff', fontFamily: '"Playfair Display", serif' }}>
                    No Properties Found
                  </h3>
                  <p style={{ color: '#a0a0a0' }}>Try exploring other categories.</p>
                </div>
              )}
            </div>
            <style jsx>{`
              @keyframes pulse {
                0% { opacity: 0.6; }
                50% { opacity: 0.8; }
                100% { opacity: 0.6; }
              }
            `}</style>
          </>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            paddingTop: '120px', // Added extra padding to clear navbar
            textAlign: 'center',
            color: '#ffffff'
          }}>
            <div style={{
              margin: '3rem 0 2rem',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(197, 162, 101, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(197, 162, 101, 0.3)'
            }}>
              <i className="ph ph-magnifying-glass" style={{ fontSize: '40px', color: '#C5A265' }}></i>
            </div>
            <h3 className="title is-3" style={{ color: '#ffffff', fontFamily: '"Playfair Display", serif', marginBottom: '1rem' }}>
              No Properties Found
            </h3>
            <p className="subtitle is-6" style={{ color: '#a0a0a0', maxWidth: '400px', lineHeight: '1.6' }}>
              We couldn't find any properties matching your current criteria.
              Try adjusting your filters or exploring other categories.
            </p>
            <a href="/properties-search?city=41&listtype=SELL" className="button is-outlined" style={{
              borderColor: '#C5A265',
              color: '#C5A265',
              background: 'transparent',
              marginTop: '1.5rem',
              borderRadius: '0',
              padding: '0 30px',
              height: '48px',
              transition: 'all 0.3s ease'
            }}>
              View All Properties
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

export default function PropertiesSearchPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', marginTop: '200px' }}>Loading...</div>}>
      <PropertiesSearchContent />
    </Suspense>
  );
}

