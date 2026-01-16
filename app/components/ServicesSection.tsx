'use client';

import { useEffect, useRef, useState } from 'react';

export default function ServicesSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [visibleCards, setVisibleCards] = useState<number>(0);

    const cards = [
        {
            icon: 'ph-magnifying-glass',
            title: 'Premium Property Search',
            description: "Access to Dubai's most exclusive off-market properties and luxury developments with our extensive network."
        },
        {
            icon: 'ph-chart-line-up',
            title: 'Investment Advisory',
            description: "Expert guidance on Dubai's real estate market trends, ROI analysis, and strategic investment opportunities."
        },
        {
            icon: 'ph-calculator',
            title: 'Property Valuation',
            description: 'Comprehensive market analysis and accurate valuations for premium Dubai real estate assets.'
        },
        {
            icon: 'ph-suitcase',
            title: 'Legal & Documentation',
            description: 'Complete legal support for property transactions, RERA compliance, and documentation in Dubai.'
        },
        {
            icon: 'ph-buildings',
            title: 'Concierge Services',
            description: 'White-glove service including property management, maintenance, and luxury lifestyle coordination.'
        },
        {
            icon: 'ph-globe-hemisphere-east',
            title: 'International Clients',
            description: 'Specialized services for overseas investors including visa guidance and banking facilitation.'
        }
    ];

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const totalHeight = sectionRef.current.clientHeight - windowHeight;

            // Calculate how far we've scrolled into the section (0 to 1)
            // rect.top goes from windowHeight (enter) to -totalHeight (exit)
            // We want the range where rect.top is between 0 and -totalHeight to be the "active" animation zone

            // Start animation when section hits top of viewport (sticky start)
            let progress = -rect.top / totalHeight;

            // Clamp progress
            if (rect.top > 0) progress = 0; // Not yet sticky
            if (rect.bottom < windowHeight) progress = 1; // Past section

            // We have 6 cards. Let's map progress 0-0.9 to cards 1-6.
            const totalCards = cards.length;

            // Determine how many cards should be visible based on progress
            // 0.0 -> 0 cards
            // 0.15 -> 1 card
            // 0.30 -> 2 cards ...

            let count = 0;
            if (rect.top > 0) {
                count = 0;
            } else if (rect.bottom <= windowHeight) {
                count = totalCards;
            } else {
                count = Math.floor(progress * (totalCards + 1));
            }

            setVisibleCards(count);
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [cards.length]);

    return (
        /* Outer wrapper with extra height to allow scrolling "through" the animation */
        <section
            className="services-section-wrapper"
            id="services-anchor"
            ref={sectionRef}
            style={{ height: '350vh', position: 'relative' }} // 350vh gives enough room for 6 steps
        >
            {/* Sticky container that stays in view */}
            <div
                className="services-section-sticky"
                style={{
                    position: 'sticky',
                    top: 0,
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {/* Reuse existing services-section styling for logic transparency, 
                    but we need to override the padding/margins to fit perfectly in 100vh 
                */}
                <div className="services-section" style={{ height: '100%', width: '100%', padding: '0', display: 'flex', alignItems: 'center' }}>

                    {/* Background elements are in CSS via .services-section::before/after */}

                    <div className="services-container">
                        <div className="atsv-header">
                            <div className="atsvh-title">Dubai Real Estate Services</div>
                            <div className="atsvh-hl"></div>
                            <div className="atsvh-txt">
                                Comprehensive luxury real estate services tailored for Dubai's dynamic market and international clientele.
                            </div>
                        </div>
                        <div className="services-grid">
                            {cards.map((card, index) => (
                                <div
                                    key={index}
                                    className={`atsv-card ${index < visibleCards ? 'visible-scroll' : ''}`}
                                // Remove inline animationDelay as logic is now scroll-driven
                                >
                                    <div className="atsvc-icon">
                                        <i className={`ph ${card.icon}`}></i>
                                    </div>
                                    <h5>{card.title}</h5>
                                    <p>{card.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
