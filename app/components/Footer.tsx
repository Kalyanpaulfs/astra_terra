'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <div className="at-footer">
      <div className="atf-content">
        <div className="columns">
          <div className="column">
            <Link href="/">
              <Image
                className="atf-brand"
                src="/img/brand.png"
                alt="astra terrah logo"
                width={150}
                height={40}
                draggable={false}
              />
            </Link>
          </div>
          <div className="column">
            <div>
              <div className="atf-infobox">
                <div className="atf-about">
                  <b>Astra Terra Properties</b> is a dynamic, one-stop-shop, full-service real estate provider dedicated to delivering exceptional property solutions across Dubai, UAE.
                </div>
              </div>
            </div>
          </div>
          <div className="column">
            <div>
              <div className="atf-infobox">
                <div className="atf-ib-title gradient-txt">Visit Us</div>
                <div className="atf-ib-txt">Oxford Tower - Office 502, 5th floor - Business Bay - Dubai</div>
              </div>
            </div>
          </div>
          <div className="column">
            <div>
              <div className="atf-infobox">
                <div className="atf-ib-title gradient-txt">Get In Touch</div>
                <ul className="atf-if-contacts">
                  <li>
                    <i className="ph ph-phone gradient-txt"></i>
                    <span>+971 58 613 1006</span>
                  </li>
                  <li>
                    <i className="ph ph-envelope-simple gradient-txt"></i>
                    <span>info@astraterra.ae</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-hr"></div>
        <div className="columns">
          <div className="column">
            <div className="atf-list">
              <div className="atfl-title">Buy</div>
              <ul className="atfl">
                <li><a href="#">Properties for Sale</a></li>
                <li><a href="#">Guide to Buying</a></li>
                <li><a href="#">Mortgages</a></li>
                <li><a href="#">Property Management</a></li>
                <li><a href="#">Legal Services</a></li>
              </ul>
            </div>
          </div>
          <div className="column">
            <div className="atf-list">
              <div className="atfl-title">Rent</div>
              <ul className="atfl">
                <li><a href="#">Properties for Rent</a></li>
                <li><a href="#">Guide to Renting</a></li>
                <li><a href="#">Property Management</a></li>
              </ul>
            </div>
            <div className="atf-list">
              <div className="atfl-title">Off Plan</div>
              <ul className="atfl">
                <li><a href="#">New Projects</a></li>
                <li><a href="#">Guide to Buying</a></li>
                <li><a href="#">Communities in Dubai</a></li>
                <li><a href="#">Developers in Dubai</a></li>
                <li><a href="#">Branded Residences</a></li>
              </ul>
            </div>
          </div>
          <div className="column">
            <div className="atf-list">
              <div className="atfl-title">Dubai Areas</div>
              <ul className="atfl">
                <li><Link href="/properties-search?regionId=47">Downtown Dubai</Link></li>
                <li><Link href="/properties-search?regionId=50">Dubai Marina</Link></li>
                <li><Link href="/properties-search?regionId=109">Palm Jumeirah</Link></li>
                <li><Link href="/properties-search?regionId=48">Business Bay</Link></li>
                <li><Link href="/properties-search?regionId=117">Dubai Hills Estate</Link></li>
              </ul>
            </div>
            <div className="atf-list">
              <div className="atfl-title">Other Locations</div>
              <ul className="atfl">
                <li><Link href="/properties-search?city=40">Abu Dhabi</Link></li>
                <li><Link href="/properties-search?city=43">Ajman</Link></li>
                <li><Link href="/properties-search?city=41">Dubai</Link></li>
                <li><Link href="/properties-search?city=44">Ras Al Khaimah</Link></li>
                <li><Link href="/properties-search?city=39">Sharjah</Link></li>
                <li><Link href="/properties-search?city=46">Umm al-Quwain</Link></li>
              </ul>
            </div>
          </div>
          <div className="column">
            <div className="atf-list">
              <div className="atfl-title">About</div>
              <ul className="atfl">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Meet The Team</a></li>
                <li><a href="#">Agents</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Developers</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="atf-foot">
        <div className="atff-info">© 2024 Astra Terra Properties Dubai. All rights reserved. | Licensed by RERA</div>
        <div className="atff-socials">
          <span className="atff-title">Follow Us</span>
          <a href="#"><i className="ph ph-instagram-logo"></i></a>
          <a href="#"><i className="ph ph-linkedin-logo"></i></a>
          <a href="#"><i className="ph ph-whatsapp-logo"></i></a>
          <a href="#"><i className="ph ph-x-logo"></i></a>
        </div>
        <div className="attf-links">
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms &amp; Conditions</a></li>
          <li><a href="#">Sitemap</a></li>
          <li><a href="#">Cookie Policy</a></li>
        </div>
      </div>
    </div>
  );
}

