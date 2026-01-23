'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function HeroParallax() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Parallax effect for video background using GSAP
        // This is much more efficient than raw scroll listeners
        // Targets are siblings/parents, so we scope globally (remove scope: containerRef)
        const videoBg = document.querySelector('.video-bg');
        if (videoBg) {
            gsap.to('.video-bg', {
                y: '30%',
                ease: 'none',
                scrollTrigger: {
                    trigger: '.at-hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                }
            });
        }
    });

    return <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, visibility: 'hidden' }} />;
}


