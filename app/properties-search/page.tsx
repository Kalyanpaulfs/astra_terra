'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PropertyCard from '../components/PropertyCard';
import { PropertiesSearchSkeleton } from '../components/Skeletons';
import Pagination from '../components/Pagination';

interface PropertyMeta {
  cities: Record<number, string>;
  regions: Record<number, string>;
  propertyTypes: string[];
}

function PropertiesSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [meta, setMeta] = useState<PropertyMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

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
        params.set('size', '1000');

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
      <section className="section" style={{ minHeight: '80vh', paddingTop: '120px', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <div className="container" style={{ maxWidth: '100%' }}>
          <PropertiesSearchSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{
      minHeight: '100vh',
      paddingLeft: '2rem',
      paddingRight: '2rem',
      paddingTop: '100px', // Reduced top space further
      backgroundImage: `linear-gradient(to bottom, rgba(5,10,16,0.9), rgba(5,10,16,0.95)), url('/img/buy-page-bg.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: 'white' // Ensure default text is white
    }}>
      <div className="container" style={{ maxWidth: '100%' }}>
        {loading ? (
          <>
            <div className="mb-6 has-text-centered">
              <div
                className="skeleton-pulse"
                style={{
                  height: '48px',
                  width: '300px',
                  backgroundColor: '#e8e8e8',
                  borderRadius: '8px',
                  margin: '0 auto 20px'
                }}
              />
              <div
                className="skeleton-pulse"
                style={{
                  height: '32px',
                  width: '200px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px',
                  margin: '0 auto'
                }}
              />
            </div>
            <PropertiesSearchSkeleton />
          </>
        ) : listings.length > 0 ? (
          <>
            <div className="mb-4" style={{
              background: 'transparent',
              marginBottom: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              width: '100%',
              position: 'relative',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>

              {/* Back Button */}
              <button
                onClick={() => router.back()}
                style={{
                  alignSelf: 'flex-start',
                  marginBottom: '1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '30px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  padding: '8px 20px',
                  transition: 'all 0.3s ease',
                  letterSpacing: '1px',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(222, 201, 147, 0.1)';
                  e.currentTarget.style.borderColor = '#DEC993';
                  e.currentTarget.style.color = '#DEC993';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = 'white';
                }}
              >
                <i className="ph ph-arrow-left" style={{ fontSize: '1rem' }}></i>
                BACK
              </button>

              {searchParams.get('type') && (
                <>
                  <h1 className="title is-1 mb-0" style={{
                    background: 'linear-gradient(to right, #DFBD69, #926F34)', // Premium Gold Gradient
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 400,
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontFamily: '"Playfair Display", serif',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    lineHeight: '1.2', // Slightly increased to ensure descenders aren't cut off
                    marginTop: '0',
                    marginBottom: '0.5rem',
                    paddingBottom: '5px' // Extra space for gradient bottom
                  }}>
                    {searchParams.get('type')}
                  </h1>

                  <p style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '1rem',
                    maxWidth: '600px',
                    lineHeight: '1.4',
                    marginTop: '0'
                  }}>
                    Explore our exclusive collection of premium {searchParams.get('type')?.toLowerCase()}s in Dubai.
                  </p>
                </>
              )}
            </div>


            <div className="is-flex is-justify-content-center is-align-items-center mt-4 mb-5">
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 30px',
                background: 'rgba(197, 162, 101, 0.05)',
                borderRadius: '50px',
                border: '1px solid rgba(197, 162, 101, 0.2)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#C5A265' }}></span>
                <p style={{
                  color: 'white', // Updated to white
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  margin: 0,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontFamily: '"Montserrat", sans-serif'
                }}>
                  {loading ? 'Loading...' : <><span style={{ color: '#C5A265', fontWeight: 700 }}>{listings.length}</span> {listings.length === 1 ? 'PROPERTY' : 'PROPERTIES'} FOUND</>}
                </p>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#C5A265' }}></span>
              </div>
            </div>

            <div className="at-properties-grid">
              {listings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((listing, idx) => (
                <div key={idx}>
                  <PropertyCard listing={listing} variant="grid" />
                </div>
              ))}
            </div>

            <div className="container mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(listings.length / itemsPerPage)}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
            {listings.length === 0 && (
              <div className="at-properties-grid">
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
              </div>
            )}
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
        )
        }
      </div >
    </section >
  );
}

export default function PropertiesSearchPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', marginTop: '200px' }}>Loading...</div>}>
      <PropertiesSearchContent />
    </Suspense>
  );
}
