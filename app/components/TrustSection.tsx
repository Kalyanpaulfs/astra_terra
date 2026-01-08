'use client';

import Image from 'next/image';

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

            <div className="dxb-most-trusted-right">
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
    );
}
