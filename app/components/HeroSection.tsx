'use client';

import { useEffect } from 'react';
import SearchBar from './SearchBar';

interface HeroSectionProps {
    cities: Record<number, string>;
    propertyTypes: string[];
}

export default function HeroSection({ cities, propertyTypes }: HeroSectionProps) {
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

    return (
        <div className="at-hero">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="video-bg"
                style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
            >
                <source src="/video/Hero_Section.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="hero-content">
                <div className="hero-header">
                    <div className="hsub-container">
                        <div className="hero-subtitle">Dubai's Premier Real Estate Partner</div>
                    </div>
                    <div className="hero-title" style={{ textAlign: 'center' }}>
                        Luxury Living in <br />
                        <span className="gradient-txt">Dubai</span>
                    </div>
                    <div className="hero-subtxt-width">
                        <div className="hero-subtxt">
                            Discover extraordinary properties in the world's most prestigious city.<br />
                            From iconic towers to waterfront palaces.
                        </div>
                    </div>
                </div>
                <SearchBar cities={cities} propertyTypes={propertyTypes} />
            </div>
        </div>
    );
}
