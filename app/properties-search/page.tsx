'use client';

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PropertyCard from '../components/PropertyCard';
import BackButton from '../components/BackButton';
import { PropertiesSearchSkeleton } from '../components/Skeletons';
import Pagination from '../components/Pagination';
import { COLORS } from '../lib/constants';
import { getBackLinkForPropertiesSearch } from '../lib/navigation-utils';
import { trackNavigation } from '../lib/navigation-history';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 9;

  // Track page view in navigation history
  useEffect(() => {
    const currentPath = `/properties-search${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    trackNavigation(currentPath);
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery(''); // Reset search when URL params change
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
        // Filter out malformed listings to prevent errors
        const validListings = (listingsData.listings || []).filter((listing: any) =>
          listing && (listing.id || listing.referenceNumber) && typeof listing.price === 'number'
        );
        setListings(validListings);
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

  // Client-side filtering
  const filteredListings = useMemo(() => {
    if (!searchQuery.trim()) return listings;
    const query = searchQuery.toLowerCase().trim();

    return listings.filter(item => {
      const title = item.title?.toLowerCase() || '';
      const community = item.community?.toLowerCase() || '';
      const region = item.region?.toLowerCase() || '';
      const developer = item.developer?.toLowerCase() || '';
      const agent = item.agent?.name?.toLowerCase() || '';

      return title.includes(query) ||
        community.includes(query) ||
        region.includes(query) ||
        developer.includes(query) ||
        agent.includes(query);
    });
  }, [listings, searchQuery]);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
      backgroundImage: `linear-gradient(to bottom, rgba(5,10,16,0.9), rgba(5,10,16,0.95)), url('/img/buy-page-bg.webp')`,
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
              <BackButton
                href="/"
                label="BACK"
                className=""
                style={{ alignSelf: "flex-start", marginBottom: "1rem", zIndex: 10 }}
              />

              {searchParams.get('type') ? (
                <>
                  <h1 className="title is-1 mb-0" style={{
                    background: COLORS.GOLD_GRADIENT, // Premium Gold Gradient
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 400,
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontFamily: '"Playfair Display", serif',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    lineHeight: '1.2',
                    marginTop: '0',
                    marginBottom: '0.5rem',
                    paddingBottom: '5px'
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
              ) : (
                <>
                  <h1 className="title is-1 mb-0" style={{
                    background: COLORS.GOLD_GRADIENT, // Premium Gold Gradient
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 400,
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontFamily: '"Playfair Display", serif',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    lineHeight: '1.2',
                    marginTop: '0',
                    marginBottom: '0.5rem',
                    paddingBottom: '5px'
                  }}>
                    {searchParams.get('listtype') === 'RENT' ? 'Properties For Rent' :
                      searchParams.get('listtype') === 'NEW' ? 'New Projects' :
                        searchParams.get('developer') ? `Properties by ${searchParams.get('developer')}` :
                          searchParams.get('regionId') && meta?.regions[Number(searchParams.get('regionId'))] ? meta.regions[Number(searchParams.get('regionId'))] :
                            'All Properties'}
                  </h1>

                  <p style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '1rem',
                    maxWidth: '600px',
                    lineHeight: '1.4',
                    marginTop: '0'
                  }}>
                    {searchParams.get('listtype') === 'RENT'
                      ? 'Discover our exclusive selection of luxury rental properties.'
                      : searchParams.get('listtype') === 'NEW'
                        ? 'Explore the latest off-plan developments in Dubai.'
                        : searchParams.get('regionId') && meta?.regions[Number(searchParams.get('regionId'))]
                          ? `Explore our exclusive properties in ${meta.regions[Number(searchParams.get('regionId'))]}.`
                          : 'Browse our complete portfolio of premium properties in Dubai.'}
                  </p>
                </>
              )}
            </div>

            {/* Search Box */}
            <div className="at-dp-search" style={{ marginBottom: '20px' }}>
              <div className="at-dp-search-wrapper" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <i className="ph ph-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Search developers, projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="at-dp-search-input"
                />
                {searchQuery && (
                  <button
                    className="at-dp-search-clear"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <i className="ph ph-x"></i>
                  </button>
                )}
              </div>
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
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: COLORS.GOLD_ACCENT }}></span>
                <p style={{
                  color: 'white', // Updated to white
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  margin: 0,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontFamily: '"Montserrat", sans-serif'
                }}>
                  {loading ? 'Loading...' : <><span style={{ color: COLORS.GOLD_ACCENT, fontWeight: 700 }}>{filteredListings.length}</span> {filteredListings.length === 1 ? 'PROPERTY' : 'PROPERTIES'} FOUND</>}
                </p>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: COLORS.GOLD_ACCENT }}></span>
              </div>
            </div>

            <div className="at-properties-grid">
              {filteredListings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((listing, idx) => (
                <div key={idx}>
                  <PropertyCard listing={listing} variant="grid" />
                </div>
              ))}
            </div>

            <div className="container mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredListings.length / itemsPerPage)}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
            {filteredListings.length === 0 && (
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
                    <i className="ph ph-house" style={{ fontSize: '28px', color: COLORS.GOLD_ACCENT }}></i>
                  </div>
                  <h3 className="title is-4" style={{ color: '#ffffff', fontFamily: '"Playfair Display", serif' }}>
                    No Projects Found
                  </h3>
                  <p style={{ color: '#a0a0a0' }}>Try adjusting your search query.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(197, 162, 101, 0.5)',
                      color: COLORS.GOLD_ACCENT,
                      padding: '8px 20px',
                      borderRadius: '30px',
                      marginTop: '15px',
                      cursor: 'pointer'
                    }}
                  >
                    Clear Search
                  </button>
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
              <i className="ph ph-magnifying-glass" style={{ fontSize: '40px', color: COLORS.GOLD_ACCENT }}></i>
            </div>
            <h3 className="title is-3" style={{ color: '#ffffff', fontFamily: '"Playfair Display", serif', marginBottom: '1rem' }}>
              No Properties Found
            </h3>
            <p className="subtitle is-6" style={{ color: '#a0a0a0', maxWidth: '400px', lineHeight: '1.6' }}>
              We couldn't find any properties matching your current criteria.
              Try adjusting your filters or exploring other categories.
            </p>
            <a href="/properties-search?city=41&listtype=SELL" className="button is-outlined" style={{
              borderColor: COLORS.GOLD_ACCENT,
              color: COLORS.GOLD_ACCENT,
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
