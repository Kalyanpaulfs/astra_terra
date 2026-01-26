
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/lib/store/hooks';
import { setProperties, setFilter } from '@/app/lib/store/features/mapSlice';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Image from 'next/image';
import Link from 'next/link';

// Custom Marker Icon with Inline Styles to avoid Tailwind issues in Leaflet
const createCustomIcon = (count?: number) => {
    return L.divIcon({
        className: 'custom-marker-icon', // We'll add a global style for this just in case
        html: `<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background-color: #10B981; border: 2px solid white; border-radius: 50%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                ${count ? `<span style="color: white; font-size: 12px; font-weight: bold;">${count}</span>` : ''}
              </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
    });
};

const defaultIcon = createCustomIcon();

interface Property {
    id: string | number;
    title: string;
    price: number | string;
    latitude?: number;
    longitude?: number;
    photos?: string[];
    imgUrl?: string[];
    [key: string]: any;
}

interface MapClientProps {
    properties: Property[];
}

const MapClient = ({ properties }: MapClientProps) => {
    // Redux Hooks
    const dispatch = useAppDispatch();
    const activeFilter = useAppSelector((state) => state.map.activeFilter);
    // Use properties from props or store? 
    // The request said "use redux to maintain the state". 
    // We should initialize the store with props, but for the map display we can use the props directly
    // OR we can use the store. Let's use the store for consistency with the request.
    // However, syncing props to store on every render can be tricky.
    // Let's rely on props for data source but use Redux for filter state as requested.
    // To strictly follow "use redux to maintain state", we should dispatch properties to store.

    // Dispatch properties to store on mount (or when properties change)
    useEffect(() => {
        dispatch(setProperties(properties));
    }, [properties, dispatch]);

    // Default center (Dubai)
    const [center, setCenter] = useState<[number, number]>([25.2048, 55.2708]);
    // const [activeFilter, setActiveFilter] = useState<'ALL' | 'SELL' | 'RENT' | 'NEW'>('ALL'); // Moved to Redux

    // Memoize validProperties to prevent re-creation on every render
    const validProperties = useMemo(() => {
        return properties.filter(p => p.latitude && p.longitude);
    }, [properties]);

    const filteredProperties = useMemo(() => {
        return validProperties.filter(property => {
            if (activeFilter === 'ALL') return true;

            // Normalize checking
            const type = property.listingType || '';
            const status = property.completionStatus || '';

            if (activeFilter === 'SELL') {
                return type === 'SELL' || property.sellParam;
            }
            if (activeFilter === 'RENT') {
                return type === 'RENT' || property.rentParam;
            }
            if (activeFilter === 'NEW') {
                // Check for various "New Project" indicators
                return type === 'NEW' ||
                    status === 'OFF_PLAN' ||
                    status === 'concept' ||
                    status === 'under_construction' ||
                    (property.propertyType && property.propertyType.includes('PROJECT'));
            }
            return true;
        });
    }, [validProperties, activeFilter]);

    // console.log(`[MapClient] Filter: ${activeFilter}, Count: ${filteredProperties.length}`);

    useEffect(() => {
        if (validProperties.length > 0) {
            const avgLat = validProperties.reduce((sum, p) => sum + (p.latitude || 0), 0) / validProperties.length;
            const avgLng = validProperties.reduce((sum, p) => sum + (p.longitude || 0), 0) / validProperties.length;
            setCenter([avgLat, avgLng]);
        }
    }, [validProperties]); // validProperties is now stable due to useMemo

    // Resize fix for Leaflet
    useEffect(() => {
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 500);
    }, []);

    return (
        <div className="w-full h-full relative z-[0] min-h-[1100px]">
            <style jsx global>{`
                .leaflet-container {
                    width: 100%;
                    height: 100%;
                    z-index: 10;
                    border-radius: 0.5rem;
                }
            `}</style>

            <MapContainer
                center={center}
                zoom={10}
                scrollWheelZoom={false}
                className="w-full h-full rounded-lg shadow-lg"
                style={{ height: '100%', width: '100%', minHeight: '1100px' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {filteredProperties.map((property) => {
                    const photo = (property.photos && property.photos.length > 0 && property.photos[0]) ||
                        (property.imgUrl && property.imgUrl.length > 0 && property.imgUrl[0]) ||
                        '/img/prop/1-thumb.webp';

                    // Determine property type slug for URL (default to 'property' if missing)
                    // The API response usually includes a propertyType field which might need normalizing
                    // e.g., "APARTMENT" -> "apartment"
                    const typeSlug = property.propertyType && property.propertyType.length > 0
                        ? property.propertyType[0].toLowerCase().replace(/_/g, '-')
                        : 'property';

                    return (
                        <Marker
                            key={property.id}
                            position={[property.latitude!, property.longitude!]}
                            icon={defaultIcon}
                        >
                            <Popup className="premium-popup">
                                <div className="min-w-[200px]">
                                    <a href={`/buy/${typeSlug}/${property.id}`} className="block relative h-32 w-full mb-2 overflow-hidden rounded-md hover:opacity-90 transition">
                                        <Image
                                            src={photo}
                                            alt={property.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </a>
                                    <h3 className="font-bold text-sm text-gray-800 line-clamp-1">{property.title}</h3>
                                    <p className="text-emerald-600 font-semibold text-sm">
                                        {typeof property.price === 'number'
                                            ? `AED ${property.price.toLocaleString()}`
                                            : property.price}
                                    </p>
                                    <a
                                        href={`/buy/${typeSlug}/${property.id}`}
                                        className="block mt-2 text-center bg-gray-900 text-white text-xs py-1.5 rounded hover:bg-gray-800 transition"
                                    >
                                        View Details
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Filter UI - Absolute Overlay with Premium Styling - Using Inline Styles for reliability */}
            <div style={{
                position: 'absolute',
                top: '120px', // Adjusted to clear the fixed Navbar
                left: '20px',
                zIndex: 500,
                backgroundColor: 'rgba(13, 22, 37, 0.95)', // Dark Navy
                backdropFilter: 'blur(10px)',
                padding: '16px',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                border: '1px solid rgba(222, 201, 147, 0.2)', // Gold border
                transition: 'all 0.3s ease'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <span style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        color: '#DEC993',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        padding: '0 4px',
                        borderBottom: '1px solid rgba(222, 201, 147, 0.2)',
                        paddingBottom: '8px'
                    }}>Filter Properties</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[
                            { id: 'ALL', label: 'All' },
                            { id: 'SELL', label: 'Buy' },
                            { id: 'RENT', label: 'Rent' },
                            { id: 'NEW', label: 'New Projects' }
                        ].map((filter) => {
                            const isActive = activeFilter === filter.id;
                            return (
                                <button
                                    key={filter.id}
                                    onClick={() => dispatch(setFilter(filter.id as any))}
                                    style={{
                                        padding: '10px 16px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        borderRadius: '8px',
                                        transition: 'all 0.3s ease',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        cursor: 'pointer',
                                        border: isActive ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                        background: isActive
                                            ? 'linear-gradient(135deg, #DEC993 0%, #C5A265 100%)'
                                            : 'rgba(255,255,255,0.05)',
                                        color: isActive ? '#0D1625' : 'rgba(255,255,255,0.7)',
                                        boxShadow: isActive ? '0 4px 15px rgba(222, 201, 147, 0.3)' : 'none',
                                        transform: isActive ? 'translateY(-1px)' : 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.color = '#DEC993';
                                            e.currentTarget.style.borderColor = 'rgba(222, 201, 147, 0.3)';
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                        }
                                    }}
                                >
                                    {filter.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapClient;
