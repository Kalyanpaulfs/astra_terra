'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import PropertyCard from '../../components/PropertyCard';
import Pagination from '../../components/Pagination';

function DeveloperDetailContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const developerName = decodeURIComponent(params.name as string);
    const activeTab = searchParams.get('type') || 'all';

    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Reset page when tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                // Fetch all properties and filter by developer on client side
                const res = await fetch('/api/properties?size=1000');
                if (res.ok) {
                    const data = await res.json();
                    const allListings = data.listings || [];

                    // Filter by developer name
                    const developerListings = allListings.filter((listing: any) => {
                        const listingDev = listing.developer || listing.developerName || listing.developerCompany || '';
                        return listingDev.toLowerCase() === developerName.toLowerCase();
                    });

                    setListings(developerListings);
                }
            } catch (error) {
                console.error('Failed to fetch listings:', error);
            } finally {
                setLoading(false);
            }
        };

        if (developerName) {
            fetchListings();
        }
    }, [developerName]);

    // Filter listings by type
    const filteredListings = useMemo(() => {
        if (activeTab === 'all') return listings;

        return listings.filter((listing: any) => {
            const type = (listing.listingType || '').toUpperCase();
            if (activeTab === 'new') return type === 'NEW' || type === 'OFF_PLAN';
            if (activeTab === 'sell') return type === 'SELL' || type === 'SALE';
            if (activeTab === 'rent') return type === 'RENT';
            return true;
        });
    }, [listings, activeTab]);

    // Count by type
    const counts = useMemo(() => {
        const result = { all: listings.length, new: 0, sell: 0, rent: 0 };
        listings.forEach((listing: any) => {
            const type = (listing.listingType || '').toUpperCase();
            if (type === 'NEW' || type === 'OFF_PLAN') result.new++;
            else if (type === 'SELL' || type === 'SALE') result.sell++;
            else if (type === 'RENT') result.rent++;
        });
        return result;
    }, [listings]);

    const handleTabChange = (tab: string) => {
        if (tab === 'all') {
            router.push(`/developers/${encodeURIComponent(developerName)}`);
        } else {
            router.push(`/developers/${encodeURIComponent(developerName)}?type=${tab}`);
        }
    };

    const paginatedListings = filteredListings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // FULL PAGE LOADING STATE - shows skeleton for entire page content
    if (loading) {
        return (
            <div className="at-developer-detail-page">
                <div className="at-ddp-header">
                    <a href="/developers" className="at-ddp-back">
                        <i className="ph ph-arrow-left"></i> Back to Developers
                    </a>
                    <h1>Properties by {developerName}</h1>
                    <div className="at-ddp-loading-indicator">
                        <div className="at-ddp-spinner"></div>
                        <p>Loading properties...</p>
                    </div>
                </div>

                {/* Skeleton tabs */}
                <div className="at-ddp-tabs">
                    <div className="at-ddp-tab-skeleton skeleton-pulse"></div>
                    <div className="at-ddp-tab-skeleton skeleton-pulse"></div>
                    <div className="at-ddp-tab-skeleton skeleton-pulse"></div>
                    <div className="at-ddp-tab-skeleton skeleton-pulse"></div>
                </div>

                {/* Skeleton grid */}
                <div className="at-properties-grid">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="at-property-skeleton">
                            <div className="skeleton-pulse" style={{ height: '200px', borderRadius: '12px' }}></div>
                            <div className="skeleton-pulse" style={{ height: '24px', width: '70%', marginTop: '16px', borderRadius: '4px' }}></div>
                            <div className="skeleton-pulse" style={{ height: '20px', width: '40%', marginTop: '10px', borderRadius: '4px' }}></div>
                            <div className="skeleton-pulse" style={{ height: '16px', width: '55%', marginTop: '8px', borderRadius: '4px' }}></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // DATA LOADED - show actual content
    return (
        <div className="at-developer-detail-page">
            <div className="at-ddp-header">
                <a href="/developers" className="at-ddp-back">
                    <i className="ph ph-arrow-left"></i> Back to Developers
                </a>
                <h1>Properties by {developerName}</h1>
                <p>{listings.length} {listings.length === 1 ? 'property' : 'properties'} available from this developer</p>
            </div>

            <div className="at-ddp-tabs">
                <button
                    className={`at-ddp-tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => handleTabChange('all')}
                >
                    All ({counts.all})
                </button>
                <button
                    className={`at-ddp-tab ${activeTab === 'new' ? 'active' : ''}`}
                    onClick={() => handleTabChange('new')}
                >
                    New ({counts.new})
                </button>
                <button
                    className={`at-ddp-tab ${activeTab === 'sell' ? 'active' : ''}`}
                    onClick={() => handleTabChange('sell')}
                >
                    Sell ({counts.sell})
                </button>
                <button
                    className={`at-ddp-tab ${activeTab === 'rent' ? 'active' : ''}`}
                    onClick={() => handleTabChange('rent')}
                >
                    Rent ({counts.rent})
                </button>
            </div>

            {filteredListings.length > 0 ? (
                <>
                    <div className="at-properties-grid">
                        {paginatedListings.map((listing, idx) => (
                            <div key={idx}>
                                <PropertyCard listing={listing} variant="grid" />
                            </div>
                        ))}
                    </div>

                    {filteredListings.length > itemsPerPage && (
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
                    )}
                </>
            ) : (
                <div className="at-ddp-empty">
                    <i className="ph ph-house" style={{ fontSize: '48px', color: '#C5A265', marginBottom: '16px' }}></i>
                    <h3>No Properties Found</h3>
                    <p>No {activeTab !== 'all' ? activeTab : ''} properties available from this developer.</p>
                </div>
            )}
        </div>
    );
}

export default function DeveloperDetailPage() {
    return (
        <Suspense fallback={
            <div className="at-developer-detail-page">
                <div className="at-ddp-header">
                    <div className="at-ddp-loading-indicator">
                        <div className="at-ddp-spinner"></div>
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        }>
            <DeveloperDetailContent />
        </Suspense>
    );
}
