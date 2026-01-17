import { Suspense } from 'react';
import DeveloperMarquee from './components/DeveloperMarquee';
import HeroSectionStreaming from './components/HeroSectionStreaming';
import FeaturedSectionStreaming from './components/FeaturedSectionStreaming';
import TrustSection from './components/TrustSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import { HeroSkeleton, FeaturedSkeleton } from './components/Skeletons';

import WhyChooseUs from './components/WhyChooseUs';

export const revalidate = 3600; // Revalidate at least every hour

export default function HomePage() {
  return (
    <>
      {/* Hero streams in - skeleton shows instantly */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSectionStreaming />
      </Suspense>

      {/* Static content - renders immediately */}
      <DeveloperMarquee />

      {/* Featured listings stream in */}
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedSectionStreaming />
      </Suspense>

      {/* Static content - renders immediately */}
      <div className="at-services" id="about-us-anchor">
        <div className="fixed-grid has-6-cols">
          <TrustSection />
        </div>
        <ServicesSection />
      </div>

      <WhyChooseUs />

      <div style={{ height: '60px', backgroundColor: '#0D1625' }}></div>
      <ContactSection />
    </>
  );
}
