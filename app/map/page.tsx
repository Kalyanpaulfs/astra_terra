
import MapSection from '@/app/components/Map/MapSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Map Search | Astra Terra Properties',
    description: 'Explore our premium properties across Dubai and Abu Dhabi on an interactive map.',
};

export default function MapPage() {
    return (
        <main className="min-h-screen bg-[#0D1625] pt-24 pb-12">
            <MapSection />
        </main>
    );
}
