import DeveloperMarquee from './components/DeveloperMarquee';
import HeroSection from './components/HeroSection';
import FeaturedSection from './components/FeaturedSection';
import TrustSection from './components/TrustSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import { getMetadata, getListings } from './lib/api';

export const revalidate = 3600; // Revalidate at least every hour

export default async function HomePage() {
  const [meta, listings] = await Promise.all([
    getMetadata(),
    getListings({ size: 12 }),
  ]);

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

