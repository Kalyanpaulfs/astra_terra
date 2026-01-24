'use client';

import { useEffect, useState, useMemo } from 'react';
import DeveloperCard from '../components/DeveloperCard';
import Pagination from '../components/Pagination';
import { COLORS } from '../lib/constants';
import { trackNavigation } from '../lib/navigation-history';

interface Developer {
    name: string;
    logo: string;
    counts: {
        new: number;
        sell: number;
        rent: number;
    };
}

export default function DevelopersPage() {
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        // Track page view
        trackNavigation('/developers');

        const fetchDevelopers = async () => {
            try {
                const res = await fetch('/api/properties?action=developers');
                if (res.ok) {
                    const data = await res.json();
                    setDevelopers(data.developers || []);
                }
            } catch (error) {
                console.error('Failed to fetch developers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDevelopers();
    }, []);

    // Filter developers based on search query
    const filteredDevelopers = useMemo(() => {
        if (!searchQuery.trim()) return developers;
        const query = searchQuery.toLowerCase().trim();
        return developers.filter(dev =>
            dev.name.toLowerCase().includes(query)
        );
    }, [developers, searchQuery]);

    // Paginate filtered results
    const paginatedDevelopers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredDevelopers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredDevelopers, currentPage]);

    const totalPages = Math.ceil(filteredDevelopers.length / itemsPerPage);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    return (
        <div className="at-developers-page">
            <div className="at-dp-header">
                <h1>Partner Developers</h1>
                <p>Explore properties from Dubai's leading real estate developers</p>
            </div>

            {/* Search Bar */}
            <div className="at-dp-search">
                <div className="at-dp-search-wrapper">
                    <i className="ph ph-magnifying-glass"></i>
                    <input
                        type="text"
                        placeholder="Search developers..."
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
                {!loading && (
                    <p className="at-dp-results-count">
                        Showing {paginatedDevelopers.length} of {filteredDevelopers.length} developers
                    </p>
                )}
            </div>

            {loading ? (
                <div className="at-dp-loading">
                    <div className="at-dp-grid">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="at-developer-card at-dc-skeleton">
                                <div className="at-dc-logo skeleton-pulse"></div>
                                <div className="at-dc-info">
                                    <div className="skeleton-pulse" style={{ height: '24px', width: '60%', marginBottom: '8px' }}></div>
                                    <div className="skeleton-pulse" style={{ height: '16px', width: '80%' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : filteredDevelopers.length > 0 ? (
                <>
                    <div className="at-dp-grid">
                        {paginatedDevelopers.map((developer, idx) => (
                            <DeveloperCard key={idx} developer={developer} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="at-dp-pagination">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => {
                                    setCurrentPage(page);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="at-dp-empty">
                    <i className="ph ph-magnifying-glass" style={{ fontSize: '48px', color: COLORS.GOLD_ACCENT, marginBottom: '16px' }}></i>
                    <h3>{searchQuery ? 'No Developers Found' : 'No Developers Available'}</h3>
                    <p>{searchQuery ? `No developers match "${searchQuery}"` : 'Developer information is currently unavailable.'}</p>
                    {searchQuery && (
                        <button
                            className="at-dp-clear-btn"
                            onClick={() => setSearchQuery('')}
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
