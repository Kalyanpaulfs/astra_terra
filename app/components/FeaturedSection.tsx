import PropertyCarousel from './PropertyCarousel';

interface FeaturedSectionProps {
    listings: any[];
}

'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import PropertyCard from './PropertyCard';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface FeaturedSectionProps {
    listings: any[];
}

export default function FeaturedSection({ listings }: FeaturedSectionProps) {
    const container = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const cards = gsap.utils.toArray<HTMLElement>('.featured-card');
        const mm = gsap.matchMedia();

        mm.add({
            // Desktop
            isDesktop: "(min-width: 769px)",
            // Mobile
            isMobile: "(max-width: 768px)",
        }, (context) => {
            const { isDesktop, isMobile } = context.conditions as { isDesktop: boolean; isMobile: boolean };

            if (isDesktop) {
                // Desktop: Horizontal stagger
                gsap.set(cards, {
                    xPercent: 120,
                    opacity: 0,
                    scale: 0.9,
                    position: 'relative',
                    left: 'auto',
                    top: 'auto'
                });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: container.current,
                        start: 'top top',
                        end: '+=300%',
                        pin: true,
                        scrub: 1,
                        anticipatePin: 1
                    }
                });

                tl.to(cards[0], { xPercent: 0, opacity: 1, scale: 1, duration: 1, ease: 'power2.out' })
                    .to(cards[1], { xPercent: 0, opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, "-=0.2")
                    .to(cards[2], { xPercent: 0, opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, "-=0.2");
            }

            if (isMobile) {
                // Mobile: Stacked deck effect (Absolute positioning handled in CSS/Inline logic via set)
                gsap.set(cards, {
                    xPercent: 150, // Come from right
                    opacity: 0,
                    scale: 0.8,
                    position: 'absolute', // Stack on top of each other
                    left: 0,
                    right: 0,
                    margin: 'auto',
                    top: 0
                });

                // Ensure first card is visible faster if desired, or same flow
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: container.current,
                        start: 'top top',
                        end: '+=300%',
                        pin: true,
                        scrub: 1,
                        anticipatePin: 1
                    }
                });

                // Animate cards in one by one, stacking
                cards.forEach((card, i) => {
                    tl.to(card, {
                        xPercent: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 1,
                        ease: 'power2.out'
                    }, i === 0 ? undefined : "-=0.5"); // Overlap slightly
                });
            }
        });

    }, { scope: container });

    return (
        <div ref={container} className="at-featured pinned-section" id="listings-anchor" style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '0', paddingTop: '80px', background: 'transparent' }}>
            {/* Background Image Layer */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
            }}>
                {/* Background Image */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url(/img/bg/featured-bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />

                {/* Dark Overlay for Readability */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, rgba(13, 22, 37, 0.4), rgba(13, 22, 37, 0.7))',
                    backdropFilter: 'blur(3px)',
                }} />
            </div>

            {/* Content Header Layer */}
            <div className="atf-header" style={{ height: '30vh', minHeight: 'auto', zIndex: 1, position: 'relative' }}>
                <div className="atfh-shc">
                    <div className="atfh-subheader">Exclusive Collection</div>
                </div>
                {/* Updated header color to white for contrast */}
                <div className="atfh-header" style={{ color: '#FFFFFF' }}>Premier Dubai Properties</div>
                <div className="atfh-hl"></div>
                {/* <p className="atfh-htxt" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Discover our curated selection of Dubai's most prestigious properties, each offering unparalleled luxury and sophistication in the world's most dynamic city.
                </p> */}
            </div>

            {/* Cards Container */}
            <div ref={cardsRef} style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '24px',
                height: '70vh',
                width: '100%',
                padding: '0 20px', // Reduced padding for mobile
                position: 'relative',
                zIndex: 2
            }}>
                {listings.slice(0, 3).map((listing, idx) => (
                    <div key={idx} className="featured-card" style={{
                        flex: '1',
                        maxWidth: '400px',
                        height: '100%',
                        maxHeight: '550px',
                        width: '100%', // Ensure width for absolute mob
                    }}>
                        {/* We use a div wrapper to control layout since PropertyCard might have its own wrapper */}
                        <div style={{ height: '100%', width: '100%' }}>
                            <PropertyCard listing={listing} variant="featured" disableWrapper={true} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
