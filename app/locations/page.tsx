'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { COLORS } from '../lib/constants';
import Pagination from '../components/Pagination';

// Premium generic images to rotate through when specific image missing
// Premium interior images to rotate through when specific image missing
const GENERIC_IMAGES = [
    '/img/prop/1.webp',
    '/img/prop/2.webp',
    '/img/prop/3.webp',
    '/img/prop/1-thumb.webp',
    '/img/hotel-new.webp', // Adding some high quality ones as fallback
    '/img/commercial-new.webp'
];

// Specific overrides if available
const REGION_IMAGES: Record<string, string> = {
    '47': '/img/contact-bg.webp', // Downtown Dubai (placeholder)
    '50': '/img/loc/bg2.webp',   // Dubai Marina
};

interface Region {
    id: string;
    name: string;
}

export default function LocationsPage() {
    const [regions, setRegions] = useState<Region[]>([]);
    const [filteredRegions, setFilteredRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Charged to 8 as requested



    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const res = await fetch('/api/properties?action=meta');
                if (res.ok) {
                    const data = await res.json();
                    if (data.regions) {
                        const regionsList = Object.entries(data.regions).map(([id, name]) => ({
                            id,
                            name: name as string
                        }));
                        setRegions(regionsList);
                        setFilteredRegions(regionsList);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch regions", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMeta();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredRegions(regions);
        } else {
            const lowerTerm = searchTerm.toLowerCase();
            const filtered = regions.filter(region =>
                region.name.toLowerCase().includes(lowerTerm)
            );
            setFilteredRegions(filtered);
        }
        setCurrentPage(1); // Reset to first page on search
    }, [searchTerm, regions]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredRegions.length / itemsPerPage);
    const currentRegions = filteredRegions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Ensure scroll to top works smoothly
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 30, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 50 } }
    };

    return (
        <div className="locations-page-wrapper" style={{
            minHeight: '100vh',
            backgroundImage: `linear-gradient(to bottom, rgba(5,10,16,0.8), rgba(5,10,16,0.95)), url('/img/buy-page-bg.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            paddingTop: '120px',
            paddingBottom: '80px',
            position: 'relative',
            overflow: 'hidden',
            color: 'white'
        }}>
            {/* Animated Background Elements */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                left: '-10%',
                width: '60vw',
                height: '60vw',
                background: 'radial-gradient(circle, rgba(222,201,147,0.08) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(60px)',
                zIndex: 0,
                pointerEvents: 'none'
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                right: '-10%',
                width: '70vw',
                height: '70vw',
                background: 'radial-gradient(circle, rgba(26,44,66,0.2) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(80px)',
                zIndex: 0,
                pointerEvents: 'none'
            }}></div>

            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '900px', margin: '0 auto 4rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h6 style={{
                            color: COLORS.DUBAI_GOLD,
                            letterSpacing: '3px',
                            textTransform: 'uppercase',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginBottom: '1rem',
                            position: 'relative',
                            zIndex: 2
                        }}>
                            Prime Locations
                        </h6>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            fontWeight: '300',
                            marginBottom: '1.5rem',
                            color: 'white',
                            lineHeight: '1.1',
                            fontFamily: '"Playfair Display", serif',
                            position: 'relative',
                            zIndex: 2
                        }}>
                            Explore Dubai's <span style={{ fontStyle: 'italic', fontWeight: '400', color: COLORS.DUBAI_GOLD }}>Finest Areas</span>
                        </h1>
                        <p style={{
                            fontSize: '1.1rem',
                            color: 'rgba(255,255,255,0.6)',
                            maxWidth: '600px',
                            margin: '0 auto',
                            lineHeight: '1.6',
                            marginBottom: '2.5rem',
                            position: 'relative',
                            zIndex: 2
                        }}>
                            From the vibrant marina to the iconic downtown, discover the perfect community for your lifestyle.
                        </p>

                        {/* Search Bar */}
                        <div style={{
                            position: 'relative',
                            maxWidth: '500px',
                            margin: '0 auto'
                        }}>
                            <input
                                type="text"
                                placeholder="Search locations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '16px 24px',
                                    paddingRight: '50px',
                                    borderRadius: '50px',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                    e.target.style.borderColor = COLORS.DUBAI_GOLD;
                                }}
                                onBlur={(e) => {
                                    e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                right: '20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: COLORS.DUBAI_GOLD,
                                fontSize: '1.2rem'
                            }}>
                                <i className="ph ph-magnifying-glass"></i>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Content Grid */}
                <div id="locations-grid">
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                border: '2px solid rgba(222,201,147,0.3)',
                                borderRadius: '50%',
                                borderTopColor: COLORS.DUBAI_GOLD,
                                animation: 'spin 1s ease-in-out infinite'
                            }}></div>
                            <style jsx>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
                        </div>
                    ) : filteredRegions.length > 0 ? (
                        <>
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                    gap: '24px',
                                    width: '100%'
                                }}
                            >
                                {currentRegions.map((region, index) => {
                                    // Use specific image if available, otherwise rotate through generic ones based on index or ID hash
                                    const genericIndex = (index + (currentPage - 1) * itemsPerPage) % GENERIC_IMAGES.length;
                                    const bgImage = REGION_IMAGES[region.id] || GENERIC_IMAGES[genericIndex];

                                    return (
                                        <motion.div key={region.id} variants={item}>
                                            <Link href={`/properties-search?regionId=${region.id}`} style={{ textDecoration: 'none' }}>
                                                <div className="group" style={{ position: 'relative', height: '350px', width: '100%' }}>
                                                    <div className="location-card-premium" style={{
                                                        position: 'relative',
                                                        height: '100%',
                                                        width: '100%',
                                                        borderRadius: '4px',
                                                        overflow: 'hidden',
                                                        cursor: 'pointer',
                                                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                                        border: '1px solid rgba(255,255,255,0.05)'
                                                    }}
                                                        onMouseEnter={(e) => {
                                                            const img = e.currentTarget.querySelector('.card-bg-img');
                                                            if (img) (img as HTMLElement).style.transform = 'scale(1.1)';
                                                            const overlay = e.currentTarget.querySelector('.card-overlay');
                                                            if (overlay) (overlay as HTMLElement).style.background = 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(13,22,37,0.4) 100%)';
                                                            const line = e.currentTarget.querySelector('.hover-line');
                                                            if (line) (line as HTMLElement).style.width = '100%';
                                                            const arrow = e.currentTarget.querySelector('.hover-arrow');
                                                            if (arrow) (arrow as HTMLElement).style.transform = 'translateX(5px)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            const img = e.currentTarget.querySelector('.card-bg-img');
                                                            if (img) (img as HTMLElement).style.transform = 'scale(1)';
                                                            const overlay = e.currentTarget.querySelector('.card-overlay');
                                                            if (overlay) (overlay as HTMLElement).style.background = 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)';
                                                            const line = e.currentTarget.querySelector('.hover-line');
                                                            if (line) (line as HTMLElement).style.width = '40px';
                                                            const arrow = e.currentTarget.querySelector('.hover-arrow');
                                                            if (arrow) (arrow as HTMLElement).style.transform = 'translateX(0)';
                                                        }}
                                                    >
                                                        {/* Background Image */}
                                                        <div className="card-bg-img" style={{
                                                            position: 'absolute',
                                                            top: 0, left: 0, right: 0, bottom: 0,
                                                            backgroundImage: `url(${bgImage})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            transition: 'transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)'
                                                        }}></div>

                                                        {/* Gradient Overlay */}
                                                        <div className="card-overlay" style={{
                                                            position: 'absolute',
                                                            top: 0, left: 0, right: 0, bottom: 0,
                                                            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)',
                                                            transition: 'background 0.5s ease'
                                                        }}></div>

                                                        {/* Content */}
                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            padding: '2rem',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'flex-start'
                                                        }}>
                                                            <div className="hover-line" style={{
                                                                width: '40px',
                                                                height: '1px',
                                                                backgroundColor: COLORS.DUBAI_GOLD,
                                                                marginBottom: '1rem',
                                                                transition: 'width 0.4s ease'
                                                            }}></div>

                                                            <h3 style={{
                                                                fontFamily: '"Playfair Display", serif',
                                                                fontSize: '1.4rem',
                                                                fontWeight: '400',
                                                                color: 'white',
                                                                marginBottom: '0.5rem',
                                                                letterSpacing: '0.5px'
                                                            }}>
                                                                {region.name}
                                                            </h3>

                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '10px',
                                                                fontSize: '0.85rem',
                                                                color: 'rgba(255,255,255,0.7)',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '1px',
                                                                marginTop: '0.5rem'
                                                            }}>
                                                                <span>View Properties</span>
                                                                <i className="ph ph-arrow-right hover-arrow" style={{ color: COLORS.DUBAI_GOLD, transition: 'transform 0.3s ease' }}></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>

                            {/* Pagination */}
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: '3rem', color: 'rgba(255,255,255,0.5)' }}>
                            <p>No locations found matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
