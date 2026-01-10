'use client';

import { useEffect } from 'react';

export default function HeroParallax() {
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

    return null; // This component only adds side effects
}

