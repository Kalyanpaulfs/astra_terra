'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import SearchBar from './components/SearchBar';
import PropertyCarousel from './components/PropertyCarousel';
import DeveloperMarquee from './components/DeveloperMarquee';
import ContactForm from './components/ContactForm';

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

  useEffect(() => {
    // Parallax effect for video background
    const handleScroll = () => {
      const video = document.querySelector('.video-bg') as HTMLVideoElement;
      if (video) {
        const scrolled = window.scrollY;
        video.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading || !meta) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="at-hero">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="video-bg"
          style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
        >
          <source src="/img/astraterrah.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>

        <div className="hero-content">
          <div className="hero-header">
            <div className="hsub-container">
              <div className="hero-subtitle">Dubai's Premier Real Estate Partner</div>
            </div>
            <div className="hero-title">
              Luxury Living in <span className="gradient-txt">Dubai</span>
            </div>
            <div className="hero-subtxt-width">
              <div className="hero-subtxt">
                Discover extraordinary properties in the world's most prestigious city.<br />
                From iconic towers to waterfront palaces.
              </div>
            </div>
          </div>
          <SearchBar cities={meta.cities} propertyTypes={meta.propertyTypes} />
        </div>
      </div>

      <DeveloperMarquee />

      <div className="at-featured" id="listings-anchor">
        <div className="atf-header">
          <div className="atfh-shc">
            <div className="atfh-subheader">Exclusive Collection</div>
          </div>
          <div className="atfh-header">Premier Dubai Properties</div>
          <div className="atfh-hl"></div>
          <p className="atfh-htxt">
            Discover our curated selection of Dubai's most prestigious properties, each offering unparalleled luxury and sophistication in the world's most dynamic city.
          </p>
        </div>
        <PropertyCarousel listings={listings} />
      </div>

      <div className="at-services" id="about-us-anchor">
        <div className="fixed-grid has-6-cols">
          <div className="dxb-most-trusted-container columns is-variable is-6 is-multiline">
            <div className="dxb-most-trusted-left column is-6-desktop is-12-mobile">
              <div className="atsv-header" style={{ alignItems: 'flex-start' }}>
                <div className="atsvh-title">Dubai's Most Trusted</div>
                <div className="atsvh-title gradient-txt">Real Estate Partner</div>
                <div className="atsvh-hl"></div>
              </div>
              <p>
                For over 15 years, Astra Terra Properties has been the trusted partner for discerning clients seeking exceptional real estate opportunities in Dubai's dynamic luxury market.
              </p>
              <br />
              <p>
                From iconic Downtown penthouses to exclusive Palm Jumeirah villas, we specialize in Dubai's most prestigious properties and provide unmatched expertise to international investors.
              </p>
              <br />
              <p>
                Our deep understanding of Dubai's unique market dynamics, combined with our extensive network and white-glove service, ensures every client finds their perfect property investment.
              </p>
              <br />

              <div className="dxb-most-trusted-stats-grid">
                <div className="dxb-most-trusted-stat">
                  <div className="dxb-most-trusted-icon gradient-txt"><i className="ph-medal"></i></div>
                  <div className="dxb-most-trusted-number">15+</div>
                  <div className="dxb-most-trusted-label">Years in Dubai</div>
                </div>
                <div className="dxb-most-trusted-stat">
                  <div className="dxb-most-trusted-icon gradient-txt"><i className="ph-users"></i></div>
                  <div className="dxb-most-trusted-number">1,200+</div>
                  <div className="dxb-most-trusted-label">International Clients</div>
                </div>
                <div className="dxb-most-trusted-stat">
                  <div className="dxb-most-trusted-icon gradient-txt"><i className="ph-buildings"></i></div>
                  <div className="dxb-most-trusted-number">2,800+</div>
                  <div className="dxb-most-trusted-label">Luxury Properties</div>
                </div>
                <div className="dxb-most-trusted-stat">
                  <div className="dxb-most-trusted-icon gradient-txt"><i className="ph-star"></i></div>
                  <div className="dxb-most-trusted-number">99%</div>
                  <div className="dxb-most-trusted-label">Client Satisfaction</div>
                </div>
              </div>
            </div>

            <div className="dxb-most-trusted-right column is-6-desktop is-12-mobile">
              <div className="dxb-most-trusted-image-wrapper">
                <Image
                  src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Beautiful Landscape"
                  width={800}
                  height={600}
                />
                <div className="dxb-most-trusted-overlay">
                  <div className="dxb-most-trusted-overlay-header">
                    <div className="gradient-txt"><i className="ph-globe"></i></div>
                    <div>Dubai Market Expertise</div>
                  </div>
                  <p style={{ color: 'black' }}>
                    Specialized knowledge in Dubai's luxury developments, investment zones, and golden visa opportunities for international clients seeking premium real estate.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="atsv-header" id="services-anchor">
            <div className="atsvh-title">Dubai Real Estate Services</div>
            <div className="atsvh-hl"></div>
            <div className="atsvh-txt">
              Comprehensive luxury real estate services tailored for Dubai's dynamic market and international clientele.
            </div>
          </div>
          <div className="columns is-multiline is-centered px-4">
            <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
              <div className="atsv-card">
                <div className="atsvc-icon">
                  <i className="ph ph-magnifying-glass"></i>
                </div>
                <h5>Premium Property Search</h5>
                <p>Access to Dubai's most exclusive off-market properties and luxury developments with our extensive network.</p>
              </div>
            </div>
            <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
              <div className="atsv-card">
                <div className="atsvc-icon">
                  <i className="ph ph-chart-line-up"></i>
                </div>
                <h5>Investment Advisory</h5>
                <p>Expert guidance on Dubai's real estate market trends, ROI analysis, and strategic investment opportunities.</p>
              </div>
            </div>
            <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
              <div className="atsv-card">
                <div className="atsvc-icon">
                  <i className="ph ph-calculator"></i>
                </div>
                <h5>Property Valuation</h5>
                <p>Comprehensive market analysis and accurate valuations for premium Dubai real estate assets.</p>
              </div>
            </div>
            <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
              <div className="atsv-card">
                <div className="atsvc-icon">
                  <i className="ph ph-suitcase"></i>
                </div>
                <h5>Legal &amp; Documentation</h5>
                <p>Complete legal support for property transactions, RERA compliance, and documentation in Dubai.</p>
              </div>
            </div>
            <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
              <div className="atsv-card">
                <div className="atsvc-icon">
                  <i className="ph ph-buildings"></i>
                </div>
                <h5>Concierge Services</h5>
                <p>White-glove service including property management, maintenance, and luxury lifestyle coordination.</p>
              </div>
            </div>
            <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
              <div className="atsv-card">
                <div className="atsvc-icon">
                  <i className="ph ph-globe-hemisphere-east"></i>
                </div>
                <h5>International Clients</h5>
                <p>Specialized services for overseas investors including visa guidance and banking facilitation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="at-featured" id="contact-us-anchor">
        <div className="atf-header">
          <div className="atfh-header">Contact Us</div>
          <div className="atfh-hl"></div>
          <p className="atfh-htxt">Ready to find your dream property? Get in touch with our expert team today.</p>
        </div>

        <div className="contact-us-content">
          <div className="contact-us-left">
            <b className="contact-us-title" style={{ color: 'black', fontSize: '25px' }}>Get In Touch</b>
            <br />
            <br />
            <p className="contact-us-description" style={{ color: 'black' }}>
              Whether you're looking to buy, sell, or invest in luxury real estate, our experienced team is here to guide you every step of the way.
            </p>
            <br />
            <div className="contact-us-grid">
              <div className="contact-us-card">
                <div className="contact-us-icon gradient-txt"><i className="ph-map-pin"></i></div>
                <div className="contact-us-card-title">Office</div>
                <div className="contact-us-card-text">
                  Oxford Tower - Office 502, 5th floor<br />
                  Business Bay - Dubai
                </div>
              </div>
              <div className="contact-us-card">
                <div className="contact-us-icon gradient-txt"><i className="ph-phone-call"></i></div>
                <div className="contact-us-card-title">Phone</div>
                <div className="contact-us-card-text">
                  +971 58 613 1006<br />
                  +971 58 558 0053
                </div>
              </div>
              <div className="contact-us-card">
                <div className="contact-us-icon gradient-txt"><i className="ph-envelope"></i></div>
                <div className="contact-us-card-title">Email</div>
                <div className="contact-us-card-text">info@astraterra.com</div>
              </div>
              <div className="contact-us-card">
                <div className="contact-us-icon gradient-txt"><i className="ph-clock"></i></div>
                <div className="contact-us-card-title">Hours</div>
                <div className="contact-us-card-text">
                  Mon-Fri: 9AM-7PM<br />
                  Sat-Sun: 10AM-5PM
                </div>
              </div>
            </div>
          </div>
          <div className="contact-us-right">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}

