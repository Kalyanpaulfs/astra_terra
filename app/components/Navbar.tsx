'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MobileNav from './MobileNav';

export default function Navbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="custom-navbar">
        <div className="custom-navbar-nav">
          <Link href="/">
            <Image
              className="custom-navbar-brand"
              src="/img/brand.png"
              alt="astra terrah logo"
              width={120}
              height={32}
              draggable={false}
            />
          </Link>
          <ul className="custom-nav-menu">
            <li>
              <a href="#">Buy</a>
              <div className="cnm-mega cnm-mega-left">
                <div className="columns">
                  <div className="column">
                    <div className="cnm-mega-content">
                      <h5 className="title is-6 has-text-white">Properties for Sale in Dubai</h5>
                      <div className="cnm-mc-csection">
                        <p className="cnm-mc-title">Properties by Type</p>
                        <div className="columns">
                          <div className="column">
                            <ul className="cnm-mc-plist">
                              <li><Link href="/properties-search?city=41&type=APARTMENT&listtype=SELL">Apartment</Link></li>
                              <li><Link href="/properties-search?city=41&type=VILLA&listtype=SELL">Villa</Link></li>
                              <li><Link href="/properties-search?city=41&type=TOWNHOUSE&listtype=SELL">Townhouse</Link></li>
                              <li><Link href="/properties-search?city=41&type=PENTHOUSE&listtype=SELL">Penthouse</Link></li>
                            </ul>
                          </div>
                          <div className="column">
                            <ul className="cnm-mc-plist">
                              <li><Link href="/properties-search?city=41&type=HOTEL_APARTMENT&listtype=SELL">Studio</Link></li>
                              <li><Link href="/properties-search?city=41&type=DUPLEX&listtype=SELL">Duplex</Link></li>
                              <li><Link href="/properties-search?city=41&type=COMMERCIAL_BUILDING&listtype=SELL">Commercial</Link></li>
                              <li><Link href="/properties-search?city=41&listtype=SELL">See All</Link></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="cnm-mc-imgs">
                      <Image src="/img/snip.webp" alt="Featured Properties" width={400} height={300} />
                      <div className="snip">
                        <h5 className="title is-6 is-white">Featured Properties</h5>
                        <Link href="#listings-anchor"><button className="button is-small is-focused">Explore Now</button></Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <a href="#">Rent</a>
              <div className="cnm-mega cnm-mega-right">
                <div className="columns">
                  <div className="column">
                    <div className="cnm-mega-content">
                      <h5 className="title is-6 has-text-white">Properties for Rent in Dubai</h5>
                      <div className="cnm-mc-csection">
                        <p className="cnm-mc-title">Properties by Type</p>
                        <div className="columns">
                          <div className="column">
                            <ul className="cnm-mc-plist">
                              <li><Link href="/properties-search?city=41&type=APARTMENT&listtype=RENT">Apartment</Link></li>
                              <li><Link href="/properties-search?city=41&type=VILLA&listtype=RENT">Villa</Link></li>
                              <li><Link href="/properties-search?city=41&type=TOWNHOUSE&listtype=RENT">Townhouse</Link></li>
                              <li><Link href="/properties-search?city=41&type=PENTHOUSE&listtype=RENT">Penthouse</Link></li>
                            </ul>
                          </div>
                          <div className="column">
                            <ul className="cnm-mc-plist">
                              <li><Link href="/properties-search?city=41&type=HOTEL_APARTMENT&listtype=RENT">Studio</Link></li>
                              <li><Link href="/properties-search?city=41&type=DUPLEX&listtype=RENT">Duplex</Link></li>
                              <li><Link href="/properties-search?city=41&type=COMMERCIAL_BUILDING&listtype=RENT">Commercial</Link></li>
                              <li><Link href="/properties-search?city=41&listtype=RENT">See All</Link></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="cnm-mc-imgs">
                      <Image src="/img/snip2.webp" alt="Exclusive Properties" width={400} height={300} />
                      <div className="snip">
                        <h5 className="title is-6 is-white">Exclusive Properties</h5>
                        <Link href="#listings-anchor"><button className="button is-small is-focused">Rent Now</button></Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li><a href="#listings-anchor">New Projects</a></li>
            <li><a href="#developers-anchor">Developers</a></li>
            <li>
              <a href="#">Locations</a>
              <div className="cnm-mega-dd">
                <ul className="dd">
                  <li><Link href="/properties-search?regionId=47">Downtown Dubai</Link></li>
                  <li><Link href="/properties-search?regionId=50">Dubai Marina</Link></li>
                  <li><Link href="/properties-search?regionId=109">Palm Jumeirah</Link></li>
                  <li><Link href="/properties-search?regionId=107">Jumeirah Lake Towers</Link></li>
                  <li><Link href="/properties-search?regionId=48">Business Bay</Link></li>
                  <li><Link href="/properties-search?regionId=108">Jumeirah Village Circle</Link></li>
                  <li><Link href="/properties-search?regionId=117">Dubai Hills Estate</Link></li>
                </ul>
              </div>
            </li>
            <li><a href="#services-anchor">Services</a></li>
            <li><Link href="/blogs">Blogs</Link></li>
            <li><a href="#why-choose-us">Why Us</a></li>
            <li>
              <a href="#">More</a>
              <div className="cnm-mega-dd">
                <ul className="dd">
                  <li><a href="#about-us-anchor">About</a></li>
                  <li><a href="#contact-us-anchor">Get In Touch</a></li>
                </ul>
              </div>
            </li>
          </ul>
          <span
            className="mob-nav-trigger"
            onClick={() => setMobileNavOpen(true)}
          >
            <Image
              className="mnt-icon"
              src="/img/nav.png"
              alt="view menu icon"
              width={24}
              height={24}
              draggable={false}
            />
          </span>
        </div>
      </div>
    </>
  );
}
