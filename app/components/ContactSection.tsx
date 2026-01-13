import ContactForm from './ContactForm';

export default function ContactSection() {
    return (
        <div className="at-featured" id="contact-us-anchor">
            <div className="atf-header">
                <div className="atfh-header">Contact Us</div>
                <div className="atfh-hl"></div>
                <p className="atfh-htxt">Ready to find your dream property? Get in touch with our expert team today.</p>
            </div>

            <div className="contact-us-content">
                <div className="contact-us-left">
                    <h3 className="contact-us-title">Get In Touch</h3>
                    <p className="contact-us-description" style={{ color: 'black' }}>
                        Whether you're looking to buy, sell, or invest in luxury real estate, our experienced team is here to guide you every step of the way.
                    </p>
                    <br />
                    <div className="contact-us-grid">
                        <div className="contact-us-card">
                            <div className="contact-us-icon"><i className="ph ph-map-pin"></i></div>
                            <div className="contact-us-card-title">Office</div>
                            <div className="contact-us-card-text">
                                Oxford Tower - Office 502, 5th floor<br />
                                Business Bay - Dubai
                            </div>
                        </div>
                        <div className="contact-us-card">
                            <div className="contact-us-icon"><i className="ph ph-phone-call"></i></div>
                            <div className="contact-us-card-title">Phone</div>
                            <div className="contact-us-card-text">
                                +971 58 558 0053
                            </div>
                        </div>
                        <div className="contact-us-card">
                            <div className="contact-us-icon"><i className="ph ph-envelope"></i></div>
                            <div className="contact-us-card-title">Email</div>
                            <div className="contact-us-card-text">info@astraterra.com</div>
                        </div>
                        <div className="contact-us-card">
                            <div className="contact-us-icon"><i className="ph ph-clock"></i></div>
                            <div className="contact-us-card-title">Hours</div>
                            <div className="contact-us-card-text">
                                Mon-Fri: 9AM-7PM<br />
                                Sat-Sun: 10AM-5PM
                            </div>
                        </div>
                    </div>
                </div>
                <div className="contact-us-right">
                    <ContactForm />
                </div>
            </div>
        </div>
    );
}
