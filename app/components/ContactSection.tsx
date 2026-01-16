import ContactForm from './ContactForm';

export default function ContactSection() {
    return (
        <section className="contact-section-premium" id="contact-us-anchor">
            {/* Background Image with Overlay */}
            <div className="contact-bg-wrapper">
                <div className="contact-bg-image"></div>
                <div className="contact-bg-overlay"></div>
            </div>

            {/* Content */}
            <div className="contact-premium-content">
                {/* Section Header */}
                <div className="contact-header">
                    <span className="contact-badge">Get In Touch</span>
                    <h2 className="contact-main-title">
                        Let's Start Your <span className="gold-text">Journey</span>
                    </h2>
                    <p className="contact-subtitle">
                        Ready to find your dream property? Our expert team is here to guide you every step of the way.
                    </p>
                </div>

                {/* Two Column Layout */}
                <div className="contact-grid-layout">
                    {/* Left - Info Cards */}
                    <div className="contact-info-side">
                        <div className="contact-info-header">
                            <h3 className="contact-info-title">Reach Out To Us</h3>
                            <p className="contact-info-desc">
                                Whether you're looking to buy, sell, or invest in luxury real estate,
                                we're here to make your vision a reality.
                            </p>
                        </div>

                        <div className="contact-cards-grid">
                            <div className="premium-contact-card">
                                <div className="pcc-icon">
                                    <i className="ph ph-map-pin"></i>
                                </div>
                                <div className="pcc-content">
                                    <h4 className="pcc-title">Visit Our Office</h4>
                                    <p className="pcc-text">
                                        Oxford Tower - Office 502, 5th floor<br />
                                        Business Bay - Dubai
                                    </p>
                                </div>
                            </div>

                            <div className="premium-contact-card">
                                <div className="pcc-icon">
                                    <i className="ph ph-phone-call"></i>
                                </div>
                                <div className="pcc-content">
                                    <h4 className="pcc-title">Call Us Directly</h4>
                                    <p className="pcc-text">+971 58 558 0053</p>
                                </div>
                            </div>

                            <div className="premium-contact-card">
                                <div className="pcc-icon">
                                    <i className="ph ph-envelope"></i>
                                </div>
                                <div className="pcc-content">
                                    <h4 className="pcc-title">Email Us</h4>
                                    <p className="pcc-text">info@astraterra.com</p>
                                </div>
                            </div>

                            <div className="premium-contact-card">
                                <div className="pcc-icon">
                                    <i className="ph ph-clock"></i>
                                </div>
                                <div className="pcc-content">
                                    <h4 className="pcc-title">Office Hours</h4>
                                    <p className="pcc-text">
                                        Mon-Fri: 9AM - 7PM<br />
                                        Sat-Sun: 10AM - 5PM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Contact Form */}
                    <div className="contact-form-side">
                        <div className="premium-form-card">
                            <div className="pfc-header">
                                <h3 className="pfc-title">Send Us a Message</h3>
                                <p className="pfc-subtitle">Fill out the form and we'll get back to you within 24 hours.</p>
                            </div>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
