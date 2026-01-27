
import { getListings } from '@/app/lib/api';
import dynamic from 'next/dynamic';

const MapClient = dynamic(() => import('./MapClient'), {
    ssr: false,
    loading: () => <div className="w-full bg-gray-100 animate-pulse rounded-lg" style={{ height: '80vh', minHeight: '600px' }} />
});

export default async function MapSection() {
    // Fetch properties for the map. 
    // We fetch a larger size to populate the map well.
    // Note: getListings in api.ts defaults to size 12, so we override it.
    const properties = await getListings({ size: 100 });
    console.log('[MapSection] Fetched properties count:', properties.length);
    if (properties.length > 0) {
        console.log('[MapSection] First property coords:',
            properties[0].latitude, properties[0].longitude);
    }


    return (
        <section className="py-8 md:py-16 lg:py-20 relative" style={{ backgroundColor: '#ffffffff' }}>
            <div className="container mx-auto px-8 md:px-6">
                <div className="mb-6 pt-10 md:mb-10 lg:mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 px-4 md:px-0">
                        <span className="text-gradient-gold">Explore</span> Locations
                    </h2>
                    {/* <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base lg:text-lg px-4 md:px-0">
                        Discover properties across Dubai and Abu Dhabi's most prestigious communities.
                    </p> */}
                </div>

                <div className="w-full rounded-xl overflow-hidden shadow-2xl border border-gray-800" style={{ height: '80vh', minHeight: '600px' }}>
                    <MapClient properties={properties} />
                </div>
            </div>
        </section>
    );
}
