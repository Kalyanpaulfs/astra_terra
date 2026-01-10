import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <div className="at-footer">
      <div className="atf-content">

        {/* TOP ROW: Logo/About, Visit Us, Get In Touch */}
        <div className="atf-top-grid">
          <div className="atf-brand-section">
            <Link href="/">
              <Image
                className="atf-brand"
                src="/img/brand.png"
                alt="astra terra properties"
                width={180}
                height={50}
                draggable={false}
              />
            </Link>
          </div>

          <div className="atf-desc-section">
            <b>Astra Terra Properties</b> is a dynamic, one-stop-shop, full-service real estate provider dedicated to delivering exceptional property solutions across Dubai, UAE.
          </div>

          <div className="atf-info-section">
            <div className="atf-ib-title">VISIT US</div>
            <div className="atf-ib-txt">
              Oxford Tower - Office 502, 5th floor<br />
              Business Bay - Dubai
            </div>
          </div>

          <div className="atf-info-section">
            <div className="atf-ib-title">GET IN TOUCH</div>
            <ul className="atf-contact-list">
              <li><i className="ph ph-phone"></i> +971 58 613 1006</li>
              <li><i className="ph ph-envelope-simple"></i> info@astraterra.ae</li>
            </ul>
          </div>
        </div>

        <div className="footer-separator"></div>

        {/* MIDDLE ROW: Links Grid (Buy, Rent, Off Plan, etc) */}
        <div className="atf-links-grid">
          {/* BUY */}
          <div className="atf-link-col">
            <div className="atfl-title">BUY</div>
            <ul className="atfl">
              <li><Link href="#">Properties for Sale</Link></li>
              <li><Link href="#">Guide to Buying</Link></li>
              <li><Link href="#">Mortgages</Link></li>
              <li><Link href="#">Property Management</Link></li>
              <li><Link href="#">Legal Services</Link></li>
            </ul>
          </div>

          {/* RENT */}
          <div className="atf-link-col">
            <div className="atfl-title">RENT</div>
            <ul className="atfl">
              <li><Link href="#">Properties for Rent</Link></li>
              <li><Link href="#">Guide to Renting</Link></li>
              <li><Link href="#">Property Management</Link></li>
            </ul>
          </div>

          {/* OFF PLAN */}
          <div className="atf-link-col">
            <div className="atfl-title">OFF PLAN</div>
            <ul className="atfl">
              <li><Link href="#">New Projects</Link></li>
              <li><Link href="#">Guide to Buying</Link></li>
              <li><Link href="#">Communities in Dubai</Link></li>
              <li><Link href="#">Developers in Dubai</Link></li>
              <li><Link href="#">Branded Residences</Link></li>
            </ul>
          </div>

          {/* DUBAI AREAS */}
          <div className="atf-link-col">
            <div className="atfl-title">DUBAI AREAS</div>
            <ul className="atfl">
              <li><Link href="/properties-search?regionId=47">Downtown Dubai</Link></li>
              <li><Link href="/properties-search?regionId=50">Dubai Marina</Link></li>
              <li><Link href="/properties-search?regionId=109">Palm Jumeirah</Link></li>
              <li><Link href="/properties-search?regionId=48">Business Bay</Link></li>
              <li><Link href="/properties-search?regionId=117">Dubai Hills Estate</Link></li>
            </ul>
          </div>

          {/* OTHER LOCATIONS */}
          <div className="atf-link-col">
            <div className="atfl-title">OTHER LOCATIONS</div>
            <ul className="atfl">
              <li><Link href="/properties-search?city=40">Abu Dhabi</Link></li>
              <li><Link href="/properties-search?city=43">Ajman</Link></li>
              <li><Link href="/properties-search?city=41">Dubai</Link></li>
              <li><Link href="/properties-search?city=44">Ras Al Khaimah</Link></li>
              <li><Link href="/properties-search?city=39">Sharjah</Link></li>
              <li><Link href="/properties-search?city=46">Umm al-Quwain</Link></li>
            </ul>
          </div>

          {/* ABOUT */}
          <div className="atf-link-col">
            <div className="atfl-title">ABOUT</div>
            <ul className="atfl">
              <li><Link href="#">About Us</Link></li>
              <li><Link href="#">Meet The Team</Link></li>
              <li><Link href="#">Agents</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Services</Link></li>
              <li><Link href="#">Developers</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-separator" style={{ opacity: 0.5 }}></div>

        {/* BOTTOM ROW: Copyright, Socials, Legal */}
        <div className="atf-bottom">
          <div className="atf-copyright">
            © 2024 Astra Terra Properties Dubai. All rights reserved. | Licensed by RERA
          </div>

          <div className="atf-socials-wrapper">
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginRight: '10px' }}>Follow Us</span>
            <div className="atf-socials">
              <a href="https://www.instagram.com/astraterra.ae" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32.04,32.04,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/josephtoubia" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm-8-24a12,12,0,1,1,12-12A12,12,0,0,1,88,88Zm104,48v40a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0v6a36,36,0,0,1,56,18Z"></path>
                </svg>
              </a>
              <a href="https://wa.me/971585580053" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M187.58,144.84l-32-16a8,8,0,0,0-8,0l-14.4,14.4a108.32,108.32,0,0,1-40.18-40.18l14.4-14.4a8,8,0,0,0,0-8l-16-32a8,8,0,0,0-11-4l-24,12a10.87,10.87,0,0,0-4.32,4c-32,32-6.52,86,30.31,122.84,27,27,65.81,42.54,89.5,30.69a10.87,10.87,0,0,0,4-4.32l12-24A8,8,0,0,0,187.58,144.84Zm-14,40.12L162.77,207c-17.79,8.9-50-5.75-72.77-28.52S62.67,123.49,71.57,105.71l22-11L107,121.2,95.73,132.5a8,8,0,0,0-1.84,8.83,124.28,124.28,0,0,0,40.78,40.78,8,8,0,0,0,8.83-1.84l11.3-11.3,26.49,13.25ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.67-6.54A88,88,0,1,1,128,216Z"></path>
                </svg>
              </a>
            </div>
          </div>

          <div className="atfl-horizontal">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms & Conditions</Link>
            <Link href="#">Sitemap</Link>
            <Link href="#">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
