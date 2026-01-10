'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

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
    return (
        <div className="dxb-most-trusted-container">
            <div className="dxb-most-trusted-left">
                <div className="atsv-header" style={{ alignItems: 'flex-start' }}>
                    <div className="atsvh-title">Dubai's Most Trusted</div>
                    <div className="atsvh-title gradient-txt">Real Estate Partner</div>
                    <div className="atsvh-hl"></div>
                </div>
                <p>
                    With over 3 years of dedicated excellence, Astra Terra Properties has established itself as a premier partner for those seeking exceptional real estate opportunities in Dubai.
                </p>
                <br />
                <p>
                    From iconic Downtown penthouses to exclusive Palm Jumeirah villas, we specialize in prestigious properties, offering personalized guidance and unmatched expertise to our global clientele.
                </p>
                <br />
                <p>
                    Our deep market insight, combined with a commitment to integrity and tailored service, ensures that every client's journey involves finding not just a property, but a true investment in their future.
                </p>
                <br />

                <div className="dxb-most-trusted-stats-grid">
                    <div className="dxb-most-trusted-stat">
                        <div className="dxb-most-trusted-icon gradient-txt"><i className="ph-medal"></i></div>
                        <AnimatedNumber end={3} suffix="+" />
                        <div className="dxb-most-trusted-label">Years Experience</div>
                    </div>
                    <div className="dxb-most-trusted-stat">
                        <div className="dxb-most-trusted-icon gradient-txt"><i className="ph-users"></i></div>
                        <AnimatedNumber end={200} suffix="+" />
                        <div className="dxb-most-trusted-label">International Clients</div>
                    </div>
                    <div className="dxb-most-trusted-stat">
                        <div className="dxb-most-trusted-icon gradient-txt"><i className="ph-buildings"></i></div>
                        <AnimatedNumber end={1000} suffix="+" />
                        <div className="dxb-most-trusted-label">Luxury Properties</div>
                    </div>
                    <div className="dxb-most-trusted-stat">
                        <div className="dxb-most-trusted-icon gradient-txt"><i className="ph-star"></i></div>
                        <AnimatedNumber end={99} suffix="%" />
                        <div className="dxb-most-trusted-label">Client Satisfaction</div>
                    </div>
                </div>
            </div>

            <div className="dxb-most-trusted-right">
                <div className="dxb-most-trusted-image-wrapper">
                    <Image
                        src="/img/dubai-trust.png"
                        alt="Astra Terra - Luxury Dubai Real Estate with Burj Khalifa View"
                        width={800}
                        height={600}
                    />
                    <div className="dxb-most-trusted-overlay">
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
