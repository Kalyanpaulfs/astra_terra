'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Mapping generic images to property types for a premium visual feel
// In a real app these should come from the CMS/API
const TYPE_IMAGES: Record<string, string> = {
    'APARTMENT': '/img/apartment-new.png',
    'VILLA': '/img/villa-new.png',
    'TOWNHOUSE': '/img/townhouse-new.png',
    'PENTHOUSE': '/img/penthouse-new.png',
    'HOTEL_APARTMENT': '/img/hotel-new.png',
    'DUPLEX': '/img/duplex-new.png',
    'COMMERCIAL_BUILDING': '/img/commercial-new.png',
    'HOTEL': '/img/luxury-hotel.png',
    'OFFICE': '/img/office.png',
    'RESIDENTIAL_BUILDING': '/img/residential-building.png',
    'RESIDENTIAL_PLOT': '/img/residential-plot.png',
    'RETAIL': '/img/retail.png',
    'SHOP': '/img/shop.png',
    // Fallbacks
    'default': '/img/snip.webp'
};

export default function RentPage() {
    const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const formatPropertyType = (type: string) => {
        return type.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const res = await fetch('/api/properties?action=meta');
                if (res.ok) {
                    const data = await res.json();
                    if (data.propertyTypes && data.propertyTypes.length > 0) {
                        setPropertyTypes(data.propertyTypes);
                    } else {
                        setPropertyTypes(['APARTMENT', 'VILLA', 'TOWNHOUSE', 'PENTHOUSE', 'HOTEL_APARTMENT', 'DUPLEX', 'COMMERCIAL_BUILDING']);
                    }
                } else {
                    setPropertyTypes(['APARTMENT', 'VILLA', 'TOWNHOUSE', 'PENTHOUSE', 'HOTEL_APARTMENT', 'DUPLEX', 'COMMERCIAL_BUILDING']);
                }
            } catch (err) {
                console.error("Failed to fetch property types", err);
                setPropertyTypes(['APARTMENT', 'VILLA', 'TOWNHOUSE', 'PENTHOUSE', 'HOTEL_APARTMENT', 'DUPLEX', 'COMMERCIAL_BUILDING']);
            } finally {
                setLoading(false);
            }
        };
        fetchMeta();
    }, []);

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
        <div className="rent-page-wrapper" style={{
            minHeight: '100vh',
            // Premium background image with overlay (Using same as buy page for consistency or generic luxury bg)
            backgroundImage: `linear-gradient(to bottom, rgba(5,10,16,0.7), rgba(5,10,16,0.9)), url('/img/buy-page-bg.png')`,
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
                <div style={{ textAlign: 'center', marginBottom: '5rem', maxWidth: '900px', margin: '0 auto 5rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h6 style={{
                            color: '#DEC993',
                            letterSpacing: '3px',
                            textTransform: 'uppercase',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginBottom: '1rem'
                        }}>
                            Properties For Rent
                        </h6>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            fontWeight: '300',
                            marginBottom: '1.5rem',
                            color: 'white',
                            lineHeight: '1.1',
                            fontFamily: '"Playfair Display", serif' // Using serif for luxury feel
                        }}>
                            Rent Your Dream <span style={{ fontStyle: 'italic', fontWeight: '400', color: '#DEC993' }}>Property</span>
                        </h1>
                        <p style={{
                            fontSize: '1.1rem',
                            color: 'rgba(255,255,255,0.6)',
                            maxWidth: '600px',
                            margin: '0 auto',
                            lineHeight: '1.6'
                        }}>
                            Discover homes that define elegance. Choose a category below to find your perfect rental.
                        </p>
                    </motion.div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '2px solid rgba(222,201,147,0.3)',
                            borderRadius: '50%',
                            borderTopColor: '#DEC993',
                            animation: 'spin 1s ease-in-out infinite'
                        }}></div>
                        <style jsx>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '24px',
                            width: '100%'
                        }}
                    >
                        {propertyTypes.map((type) => {
                            const bgImage = TYPE_IMAGES[type] || TYPE_IMAGES['default'];
                            return (
                                <motion.div key={type} variants={item}>
                                    <Link href={`/properties-search?type=${encodeURIComponent(type)}&listtype=RENT`} style={{ textDecoration: 'none' }}>
                                        <div className="group" style={{ position: 'relative', height: '400px', width: '100%' }}>
                                            <div className="buy-card-premium" style={{
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
                                                }}
                                                onMouseLeave={(e) => {
                                                    const img = e.currentTarget.querySelector('.card-bg-img');
                                                    if (img) (img as HTMLElement).style.transform = 'scale(1)';
                                                    const overlay = e.currentTarget.querySelector('.card-overlay');
                                                    if (overlay) (overlay as HTMLElement).style.background = 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)';
                                                    const line = e.currentTarget.querySelector('.hover-line');
                                                    if (line) (line as HTMLElement).style.width = '40px';
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
                                                        backgroundColor: '#DEC993',
                                                        marginBottom: '1rem',
                                                        transition: 'width 0.4s ease'
                                                    }}></div>

                                                    <h3 style={{
                                                        fontFamily: '"Playfair Display", serif',
                                                        fontSize: '1.5rem', // Fixed size for consistency
                                                        fontWeight: '400',
                                                        color: 'white',
                                                        marginBottom: '0.5rem',
                                                        letterSpacing: '0.5px',
                                                        textAlign: 'left'
                                                    }}>
                                                        {formatPropertyType(type)}
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
                                                        <span>View Collection</span>
                                                        <i className="ph ph-arrow-right" style={{ color: '#DEC993' }}></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
