'use client';

import { useEffect, useState } from 'react';
import DeveloperMarquee from './components/DeveloperMarquee';
import HeroSection from './components/HeroSection';
import FeaturedSection from './components/FeaturedSection';
import TrustSection from './components/TrustSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';

interface PropertyMeta {
  cities: Record<number, string>;
  regions: Record<number, string>;
  propertyTypes: string[];
}

export default function HomePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [meta, setMeta] = useState<PropertyMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch metadata
        const metaResponse = await fetch('/api/properties?action=meta');
        const metaData = await metaResponse.json();
        setMeta(metaData);

        // Fetch featured properties
        const listingsResponse = await fetch('/api/properties?size=12');
        const listingsData = await listingsResponse.json();
        setListings(listingsData.listings || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !meta) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <HeroSection cities={meta.cities} propertyTypes={meta.propertyTypes} />

      <DeveloperMarquee />

      <FeaturedSection listings={listings} />

      <div className="at-services" id="about-us-anchor">
        <div className="fixed-grid has-6-cols">
          <TrustSection />
        </div>
        <ServicesSection />
      </div>

      <ContactSection />
    </>
  );
}

