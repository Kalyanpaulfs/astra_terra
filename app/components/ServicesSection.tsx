'use client';

export default function ServicesSection() {
    return (
        <section className="services-container" id="services-anchor">
            <div className="atsv-header">
                <div className="atsvh-title">Dubai Real Estate Services</div>
                <div className="atsvh-hl"></div>
                <div className="atsvh-txt">
                    Comprehensive luxury real estate services tailored for Dubai's dynamic market and international clientele.
                </div>
            </div>
            <div className="services-grid">
                <div className="atsv-card">
                    <div className="atsvc-icon">
                        <i className="ph ph-magnifying-glass"></i>
                    </div>
                    <h5>Premium Property Search</h5>
                    <p>Access to Dubai's most exclusive off-market properties and luxury developments with our extensive network.</p>
                </div>
                <div className="atsv-card">
                    <div className="atsvc-icon">
                        <i className="ph ph-chart-line-up"></i>
                    </div>
                    <h5>Investment Advisory</h5>
                    <p>Expert guidance on Dubai's real estate market trends, ROI analysis, and strategic investment opportunities.</p>
                </div>
                <div className="atsv-card">
                    <div className="atsvc-icon">
                        <i className="ph ph-calculator"></i>
                    </div>
                    <h5>Property Valuation</h5>
                    <p>Comprehensive market analysis and accurate valuations for premium Dubai real estate assets.</p>
                </div>
                <div className="atsv-card">
                    <div className="atsvc-icon">
                        <i className="ph ph-suitcase"></i>
                    </div>
                    <h5>Legal &amp; Documentation</h5>
                    <p>Complete legal support for property transactions, RERA compliance, and documentation in Dubai.</p>
                </div>
                <div className="atsv-card">
                    <div className="atsvc-icon">
                        <i className="ph ph-buildings"></i>
                    </div>
                    <h5>Concierge Services</h5>
                    <p>White-glove service including property management, maintenance, and luxury lifestyle coordination.</p>
                </div>
                <div className="atsv-card">
                    <div className="atsvc-icon">
                        <i className="ph ph-globe-hemisphere-east"></i>
                    </div>
                    <h5>International Clients</h5>
                    <p>Specialized services for overseas investors including visa guidance and banking facilitation.</p>
                </div>
            </div>
        </section>
    );
}
