
'use client';

import { useEffect, useState } from 'react';
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
    // Default center (Dubai)
    const [center, setCenter] = useState<[number, number]>([25.2048, 55.2708]);

    // Filter properties
    const validProperties = properties.filter(p => p.latitude && p.longitude);

    console.log('[MapClient] Rendering with valid properties:', validProperties.length);
    if (validProperties.length > 0) {
        console.log('[MapClient] First 3 property coords:', validProperties.slice(0, 3).map(p => ({ id: p.id, lat: p.latitude, lng: p.longitude, title: p.title })));
    }


    useEffect(() => {
        if (validProperties.length > 0) {
            const avgLat = validProperties.reduce((sum, p) => sum + (p.latitude || 0), 0) / validProperties.length;
            const avgLng = validProperties.reduce((sum, p) => sum + (p.longitude || 0), 0) / validProperties.length;
            setCenter([avgLat, avgLng]);
        }
    }, [validProperties]);

    // Resize fix for Leaflet
    useEffect(() => {
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 500);
    }, []);

    return (
        <div className="w-full h-full relative z-0 min-h-[500px]">
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
                style={{ height: '100%', width: '100%', minHeight: '500px' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {validProperties.map((property) => {
                    const photo = (property.photos && property.photos.length > 0 && property.photos[0]) ||
                        (property.imgUrl && property.imgUrl.length > 0 && property.imgUrl[0]) ||
                        '/img/placeholder.jpg';

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
        </div>
    );
};

export default MapClient;
