'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchProperty, fetchListings } from '@/app/lib/actions';
import PropertyCard from './PropertyCard';
import { COLORS } from '@/app/lib/constants';

import { usePathname } from 'next/navigation';
import { getBackLinkForPropertyDetails } from '@/app/lib/navigation-utils';
import { trackNavigation, getPreviousPage } from '@/app/lib/navigation-history';

export default function PropertyDetails() {
    const { id } = useParams();
    const pathname = usePathname();
    const [property, setProperty] = useState<any>(null);
    const [similarProperties, setSimilarProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    // Track this page view in navigation history
    useEffect(() => {
        if (pathname) {
            trackNavigation(pathname);
        }
    }, [pathname]);

    // Determine smart back link based on navigation history
    const getSmartBackLink = () => {
        // First, try to get the previous page from history
        const previousPage = getPreviousPage(pathname || '');

        if (previousPage) {
            // If the previous page was properties-search, use it directly
            if (previousPage.includes('/properties-search')) {
                return previousPage;
            }
            // If the previous page was locations, developers, buy, or rent, use it
            if (previousPage.includes('/locations') ||
                previousPage.includes('/developers') ||
                previousPage === '/buy' ||
                previousPage === '/rent') {
                return previousPage;
            }
        }

        // Fall back to smart link generation based on current context
        return getBackLinkForPropertyDetails(pathname, property?.propertyType);
    };

    const backLink = getSmartBackLink();


    useEffect(() => {
        if (!id) return;
        const fetchDetails = async () => {
            try {
                // Use Server Action
                const data = await fetchProperty(id as string);
                setProperty(data);

                if (data) {
                    // Fetch similar properties via Server Action
                    try {
                        const typeFilter = data.propertyType && data.propertyType.length > 0 ? data.propertyType : undefined;
                        const similar = await fetchListings({
                            listingType: data.listingType,
                            propertyType: typeFilter,
                            size: 4
                        });
                        setSimilarProperties(similar.filter((p: any) => p.id !== data.id && p.referenceNumber !== data.referenceNumber).slice(0, 3));
                    } catch (e) {
                        console.error("Similar fetch error", e);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch property", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0D1625', color: 'COLORS.DUBAI_GOLD', paddingLeft: '2rem', paddingRight: '2rem' }}>
            <div className="ba-spinner"></div>
        </div>
    );

    if (!property) return (
        <div style={{ minHeight: '60vh', textAlign: 'center', padding: '100px 20px', background: '#0D1625', color: 'white' }}>
            <h2>Property Not Found</h2>
            <Link href="/" style={{ color: 'COLORS.DUBAI_GOLD', textDecoration: 'underline', marginTop: '20px', display: 'block' }}>Return Home</Link>
        </div>
    );

    const formatPrice = (price: number) => new Intl.NumberFormat('en-AE').format(price);
    const phone = property.agent?.phone?.replace(/\D/g, '') || '';

    // Extract data from newParam or use fallback values
    const bedroomDisplay = property.newParam?.bedroomMin && property.newParam?.bedroomMax
        ? `${property.newParam.bedroomMin}-${property.newParam.bedroomMax}`
        : (property.bedRooms || '-');

    const sizeDisplay = property.newParam?.minSize && property.newParam?.maxSize
        ? `${property.newParam.minSize}-${property.newParam.maxSize}`
        : (property.size || '-');

    const bathrooms = property.moreParam?.bathrooms || property.rentParam?.bathrooms || '-';
    const parking = property.moreParam?.parking || property.newParam?.parking || property.rentParam?.parking || '-';

    // Parse payment plan if available
    let paymentPlan = null;
    if (property.newParam?.paymentPlan) {
        try {
            paymentPlan = JSON.parse(property.newParam.paymentPlan);
        } catch (e) {
            console.error('Failed to parse payment plan:', e);
        }
    }

    // Format handover date
    const handoverDate = property.newParam?.handoverTime ? new Date(property.newParam.handoverTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : null;

    // Pluralization helper
    const pluralize = (count: number | string, singular: string, plural: string) => {
        if (count === '-' || count === '—') return singular;
        const num = typeof count === 'string' ? parseFloat(count) : count;
        return num === 1 ? singular : plural;
    };

    return (
        <div style={{ backgroundColor: '#0D1625', minHeight: '100vh', color: '#ffffff', paddingBottom: '80px' }}>
            <style jsx global>{`
                .pd-container {
                    padding-top: 120px;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding-left: 2rem;
                    padding-right: 2rem;
                }
                .pd-header {
                    margin-bottom: 2rem;
                }
                .pd-header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    flex-wrap: wrap;
                    gap: 20px;
                }
                /* Desktop Grid: 2 columns (2fr 1fr) */
                .pd-gallery {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 20px;
                    height: 500px; /* RESTRICT HEIGHT to stop it taking full screen */
                    margin-bottom: 4rem;
                }
                .pd-thumbs {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    overflow-y: auto;
                    padding-right: 5px;
                    height: 100%;
                }
                .pd-thumb-item {
                    position: relative;
                    height: 150px;
                    border-radius: 8px;
                    overflow: hidden;
                    cursor: pointer;
                    flex-shrink: 0;
                }
                .pd-content {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 60px;
                }
                .contact-card {
                    background: #1A222F;
                    padding: 30px;
                    border-radius: 16px;
                    border: 1px solid rgba(222, 201, 147, 0.2);
                    position: sticky;
                    top: 120px;
                    z-index: 10;
                }
                .similar-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 30px;
                }

                /* Mobile Layout */
                @media (max-width: 768px) {
                    .pd-container {
                        padding-top: 100px;
                        padding-left: 15px;
                        padding-right: 15px;
                    }
                    .pd-header-content {
                        flex-direction: column;
                    }
                    .pd-gallery {
                        grid-template-columns: 1fr; /* Stack images */
                        height: auto;
                    }
                    /* Main Image Height on Mobile: Restricted */
                    .pd-main-img {
                        height: 300px !important; 
                        width: 100%;
                    }
                    .pd-thumbs {
                        flex-direction: row; /* Horizontal scroll */
                        overflow-x: auto;
                        overflow-y: hidden;
                        height: 100px;
                        padding-bottom: 10px;
                        width: 100%;
                    }
                    .pd-thumb-item {
                        height: 100%;
                        min-width: 120px;
                        width: 120px;
                    }
                    .pd-content {
                        grid-template-columns: 1fr; /* Stack content */
                        gap: 40px;
                    }
                    .contact-card {
                        position: static;
                    }
                    .similar-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div className="pd-container">

                {/* Header Section */}
                <div className="pd-header">
                    <div className="pd-header-content">
                        <div style={{ width: '100%', marginBottom: '10px' }}>
                            <Link href={backLink} className="button is-small is-ghost pl-0" style={{ color: 'COLORS.DUBAI_GOLD', textDecoration: 'none' }}>
                                <i className="ph ph-arrow-left" style={{ marginRight: '5px' }}></i> Back to Search
                            </Link>
                        </div>
                        <div style={{ flex: 1 }}>
                            {/* Tag removed as requested */}
                            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', margin: '0 0 10px 0', lineHeight: 1.2 }}>
                                {property.title}
                            </h1>
                            <div style={{ color: '#b0b0b0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="ph-fill ph-map-pin" style={{ color: 'COLORS.DUBAI_GOLD' }}></i>
                                {property.community && property.cityName ? `${property.community}, ${property.cityName}` : (property.community || property.region)}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', width: '100%' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'COLORS.DUBAI_GOLD' }}>
                                AED {formatPrice(property.price)}
                            </div>
                            <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>
                                {property.listingType === 'RENT' && property.rentParam ?
                                    (property.rentParam.frequency ? `/ ${property.rentParam.frequency}` : '/ year')
                                    : ''}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="pd-gallery">
                    <div className="pd-main-img" style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', height: '100%', minHeight: '300px' }}>
                        <Image
                            src={property.photos?.[selectedImage] || '/img/prop/default-large.webp'}
                            alt={property.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                    </div>
                    <div className="pd-thumbs">
                        {property.photos?.map((photo: string, idx: number) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                className="pd-thumb-item"
                                style={{
                                    border: selectedImage === idx ? '2px solid COLORS.DUBAI_GOLD' : '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                <Image
                                    src={photo}
                                    alt={`View ${idx}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Layout */}
                <div className="pd-content">

                    {/* Left: Description & Specs */}
                    <div>
                        {/* Key Specs Bar */}
                        <div style={{
                            display: 'flex',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            padding: '20px',
                            justifyContent: 'space-around',
                            marginBottom: '3rem',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <i className="ph ph-bed" style={{ fontSize: '1.5rem', color: 'COLORS.DUBAI_GOLD', marginBottom: '5px', display: 'block' }}></i>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{bedroomDisplay}</span> <span style={{ color: '#888', fontSize: '0.9rem' }}>{pluralize(bedroomDisplay, 'Bed', 'Beds')}</span>
                            </div>
                            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                            <div style={{ textAlign: 'center' }}>
                                <i className="ph ph-shower" style={{ fontSize: '1.5rem', color: 'COLORS.DUBAI_GOLD', marginBottom: '5px', display: 'block' }}></i>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{bathrooms}</span> <span style={{ color: '#888', fontSize: '0.9rem' }}>{pluralize(bathrooms, 'Bath', 'Baths')}</span>
                            </div>
                            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                            <div style={{ textAlign: 'center' }}>
                                <i className="ph ph-arrows-out" style={{ fontSize: '1.5rem', color: 'COLORS.DUBAI_GOLD', marginBottom: '5px', display: 'block' }}></i>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{sizeDisplay}</span> <span style={{ color: '#888', fontSize: '0.9rem' }}>Sq Ft</span>
                            </div>
                            {parking !== '-' && (
                                <>
                                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                                    <div style={{ textAlign: 'center' }}>
                                        <i className="ph ph-car" style={{ fontSize: '1.5rem', color: 'COLORS.DUBAI_GOLD', marginBottom: '5px', display: 'block' }}></i>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{parking}</span> <span style={{ color: '#888', fontSize: '0.9rem' }}>Parking</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={{ fontSize: '1.5rem', color: 'COLORS.DUBAI_GOLD', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>Description</h3>
                            <div style={{
                                lineHeight: '1.8',
                                color: '#ccc',
                                whiteSpace: 'pre-wrap',
                                fontSize: '1.05rem'
                            }}>
                                {property.description || "No description available for this property."}
                            </div>
                        </div>

                        {/* Payment Plan & Handover */}
                        {(paymentPlan || handoverDate) && (
                            <div style={{ marginBottom: '3rem' }}>
                                <h3 style={{ fontSize: '1.5rem', color: 'COLORS.DUBAI_GOLD', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>Payment Plan & Handover</h3>
                                <div style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    padding: '30px',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    {handoverDate && (
                                        <div style={{ marginBottom: paymentPlan ? '25px' : '0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                background: 'rgba(222, 201, 147, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <i className="ph ph-calendar" style={{ fontSize: '1.5rem', color: 'COLORS.DUBAI_GOLD' }}></i>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '3px' }}>Handover Date</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff' }}>{handoverDate}</div>
                                            </div>
                                        </div>
                                    )}
                                    {paymentPlan && (
                                        <div>
                                            <div style={{ fontSize: '0.95rem', color: '#ccc', marginBottom: '20px' }}>Flexible Payment Structure</div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px' }}>
                                                {paymentPlan.one && parseInt(paymentPlan.one) > 0 && (
                                                    <div style={{
                                                        background: 'rgba(255,255,255,0.03)',
                                                        padding: '15px',
                                                        borderRadius: '8px',
                                                        border: '1px solid rgba(255,255,255,0.05)',
                                                        textAlign: 'center'
                                                    }}>
                                                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'COLORS.DUBAI_GOLD' }}>{paymentPlan.one}%</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>Down Payment</div>
                                                    </div>
                                                )}
                                                {paymentPlan.two && parseInt(paymentPlan.two) > 0 && (
                                                    <div style={{
                                                        background: 'rgba(255,255,255,0.03)',
                                                        padding: '15px',
                                                        borderRadius: '8px',
                                                        border: '1px solid rgba(255,255,255,0.05)',
                                                        textAlign: 'center'
                                                    }}>
                                                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'COLORS.DUBAI_GOLD' }}>{paymentPlan.two}%</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>During Construction</div>
                                                    </div>
                                                )}
                                                {paymentPlan.three && parseInt(paymentPlan.three) > 0 && (
                                                    <div style={{
                                                        background: 'rgba(255,255,255,0.03)',
                                                        padding: '15px',
                                                        borderRadius: '8px',
                                                        border: '1px solid rgba(255,255,255,0.05)',
                                                        textAlign: 'center'
                                                    }}>
                                                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'COLORS.DUBAI_GOLD' }}>{paymentPlan.three}%</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>On Handover</div>
                                                    </div>
                                                )}
                                                {Number(paymentPlan.four) > 0 && (
                                                    <div style={{
                                                        background: 'rgba(255,255,255,0.03)',
                                                        padding: '15px',
                                                        borderRadius: '8px',
                                                        border: '1px solid rgba(255,255,255,0.05)',
                                                        textAlign: 'center'
                                                    }}>
                                                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'COLORS.DUBAI_GOLD' }}>{paymentPlan.four}%</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>Post-Handover</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Amenities */}
                        {property.amenities && property.amenities.length > 0 && (
                            <div style={{ marginBottom: '3rem' }}>
                                <h3 style={{ fontSize: '1.5rem', color: 'COLORS.DUBAI_GOLD', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>Amenities</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {property.amenities.map((am: string, idx: number) => (
                                        <span key={idx} style={{
                                            background: 'rgba(255,255,255,0.08)',
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem',
                                            border: '1px solid rgba(255,255,255,0.05)'
                                        }}>
                                            {am.replace(/_/g, ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Agent / Contact */}
                    <div>
                        <div className="contact-card">
                            <h3 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                                Interested?
                            </h3>

                            {property.agent && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        background: '#262E3B',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {property.agent.photo ? (
                                            <Image src={property.agent.photo} alt="Agent" width={60} height={60} />
                                        ) : (
                                            <i className="ph ph-user" style={{ fontSize: '1.5rem', color: '#888' }}></i>
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: 'COLORS.DUBAI_GOLD' }}>{property.agent.name || 'Property Consultant'}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Astra Terra Expert</div>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {phone ? (
                                    <>
                                        <a href={`tel:${phone}`} className="ba-btn" style={{ textAlign: 'center', textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                            <i className="ph-fill ph-phone"></i> Call Agent
                                        </a>
                                        <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" className="ba-btn ba-btn-outline" style={{ textAlign: 'center', textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                            <i className="ph-fill ph-whatsapp-logo"></i> WhatsApp
                                        </a>
                                    </>
                                ) : (
                                    <button className="ba-btn" disabled style={{ opacity: 0.5 }}>Contact Unavailable</button>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Similar Properties Section */}
                {similarProperties.length > 0 && (
                    <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ fontSize: '1.8rem', color: 'COLORS.DUBAI_GOLD', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>
                            Similar Properties
                        </h3>
                        <div className="similar-grid">
                            {similarProperties.map((p, i) => (
                                <div key={i}>
                                    <PropertyCard listing={p} variant="featured" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
