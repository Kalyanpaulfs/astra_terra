'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface AnimatedNumberProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
}

const AnimatedNumber = ({ end, duration = 4000, suffix = '', prefix = '' }: AnimatedNumberProps) => {
    const [count, setCount] = useState(0);
    const elementRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        // Cleanup previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Reset and start animation
                        let startTime: number | null = null;
                        const animate = (timestamp: number) => {
                            if (!startTime) startTime = timestamp;
                            const progress = Math.min((timestamp - startTime) / duration, 1);

                            // Easing function for smooth effect (easeOutExpo)
                            // 1 - Math.pow(2, -10 * progress)
                            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                            setCount(Math.floor(easeProgress * end));

                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            }
                        };
                        requestAnimationFrame(animate);
                    } else {
                        // Reset when out of view so it animates again
                        setCount(0);
                    }
                });
            },
            { threshold: 0.1 } // Trigger when 10% visible
        );

        observerRef.current.observe(element);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [end, duration]);

    return (
        <div ref={elementRef} className="dxb-most-trusted-number">
            {prefix}{count.toLocaleString()}{suffix}
        </div>
    );
};

export default function TrustSection() {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            mirror: false,
        });
    }, []);
    return (
        <div className="dxb-most-trusted-container">
            <div className="dxb-most-trusted-left" data-aos="fade-right">
                <div className="atsv-header" style={{ alignItems: 'flex-start', textAlign: 'left', gap: '5px' }}>
                    <div className="dxb-section-label" data-aos="fade-up" data-aos-delay="100">ABOUT ASTRA TERRA</div>
                    <div className="atsvh-title dxb-big-title" style={{ marginBottom: '-5px' }} data-aos="fade-up" data-aos-delay="200">Dubai's Most Trusted</div>
                    <div className="atsvh-title gradient-txt dxb-big-title" data-aos="fade-up" data-aos-delay="300">Real Estate Partner</div>
                    <div className="atsvh-hl" style={{ marginTop: '20px' }} data-aos="fade-up" data-aos-delay="400"></div>
                </div>
                <p className="dxb-text-para" data-aos="fade-up" data-aos-delay="500">
                    For over 3 years, Astra Terra Properties has been the trusted partner for discerning clients seeking exceptional real estate opportunities in Dubai's dynamic luxury market.
                </p>
                <p className="dxb-text-para" data-aos="fade-up" data-aos-delay="600">
                    From iconic Downtown penthouses to exclusive Palm Jumeirah villas, we specialize in Dubai's most prestigious properties and provide unmatched expertise to international investors.
                </p>
                <p className="dxb-text-para" data-aos="fade-up" data-aos-delay="700">
                    Our deep understanding of Dubai's unique market dynamics, combined with our extensive network and white-glove service, ensures every client finds their perfect property investment.
                </p>

                <div className="dxb-most-trusted-stats-grid">
                    <div className="dxb-most-trusted-stat" data-aos="zoom-in" data-aos-delay="800">
                        <div className="dxb-most-trusted-icon"><i className="ph ph-medal"></i></div>
                        <AnimatedNumber end={3} suffix="+" />
                        <div className="dxb-most-trusted-label">Years Experience</div>
                    </div>
                    <div className="dxb-most-trusted-stat" data-aos="zoom-in" data-aos-delay="900">
                        <div className="dxb-most-trusted-icon"><i className="ph ph-users"></i></div>
                        <AnimatedNumber end={200} suffix="+" />
                        <div className="dxb-most-trusted-label">International Clients</div>
                    </div>
                    <div className="dxb-most-trusted-stat" data-aos="zoom-in" data-aos-delay="1000">
                        <div className="dxb-most-trusted-icon"><i className="ph ph-buildings"></i></div>
                        <AnimatedNumber end={1000} suffix="+" />
                        <div className="dxb-most-trusted-label">Luxury Properties</div>
                    </div>
                    <div className="dxb-most-trusted-stat" data-aos="zoom-in" data-aos-delay="1100">
                        <div className="dxb-most-trusted-icon"><i className="ph ph-star"></i></div>
                        <AnimatedNumber end={99} suffix="%" />
                        <div className="dxb-most-trusted-label">Client Satisfaction</div>
                    </div>
                </div>
            </div>

            <div className="dxb-most-trusted-right" data-aos="fade-left" data-aos-delay="200">
                <div className="dxb-most-trusted-image-wrapper">
                    <Image
                        src="/img/dubai-trust.png"
                        alt="Astra Terra - Luxury Dubai Real Estate with Burj Khalifa View"
                        width={800}
                        height={600}
                    />
                    <div className="dxb-most-trusted-overlay" data-aos="fade-up" data-aos-delay="1200">
                        <div className="dxb-most-trusted-overlay-header">
                            <div className="gradient-txt"><i className="ph-globe"></i></div>
                            <div>Dubai Market Expertise</div>
                        </div>
                        <p>
                            Specialized knowledge in Dubai's luxury developments, investment zones, and golden visa opportunities for international clients seeking premium real estate.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
