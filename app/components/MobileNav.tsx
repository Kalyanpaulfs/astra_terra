'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'scroll';
    }
    return () => {
      document.body.style.overflowY = 'scroll';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="mobile-nav-frame" onClick={onClose}>
      <div className="mobile-nav-menu" onClick={(e) => e.stopPropagation()}>
        <span className="mnm-close" onClick={onClose}>Close</span>
        <Image
          className="mnm-logo"
          src="/img/brand.png"
          alt="astra terrah logo"
          width={150}
          height={40}
          draggable={false}
        />
        <ul className="mnm2-links">
          <li className={openSubmenu === 'buy' ? 'has-sub open' : 'has-sub'}>
            <a href="#" onClick={(e) => { e.preventDefault(); setOpenSubmenu(openSubmenu === 'buy' ? null : 'buy'); }}>
              Buy
            </a>
            <ul className="sub-links">
              <li><Link href="/properties-search?city=41&type=APARTMENT&listtype=SELL" onClick={onClose}>Apartment</Link></li>
              <li><Link href="/properties-search?city=41&type=VILLA&listtype=SELL" onClick={onClose}>Villa</Link></li>
              <li><Link href="/properties-search?city=41&type=TOWNHOUSE&listtype=SELL" onClick={onClose}>Townhouse</Link></li>
              <li><Link href="/properties-search?city=41&type=PENTHOUSE&listtype=SELL" onClick={onClose}>Penthouse</Link></li>
              <li><Link href="/properties-search?city=41&type=HOTEL_APARTMENT&listtype=SELL" onClick={onClose}>Studio</Link></li>
              <li><Link href="/properties-search?city=41&type=DUPLEX&listtype=SELL" onClick={onClose}>Duplex</Link></li>
              <li><Link href="/properties-search?city=41&type=COMMERCIAL_BUILDING&listtype=SELL" onClick={onClose}>Commercial</Link></li>
              <li><Link href="/properties-search?city=41&listtype=SELL" onClick={onClose}>See All</Link></li>
            </ul>
          </li>
          <li className={openSubmenu === 'rent' ? 'has-sub open' : 'has-sub'}>
            <a href="#" onClick={(e) => { e.preventDefault(); setOpenSubmenu(openSubmenu === 'rent' ? null : 'rent'); }}>
              Rent
            </a>
            <ul className="sub-links">
              <li><Link href="/properties-search?city=41&type=APARTMENT&listtype=RENT" onClick={onClose}>Apartment</Link></li>
              <li><Link href="/properties-search?city=41&type=VILLA&listtype=RENT" onClick={onClose}>Villa</Link></li>
              <li><Link href="/properties-search?city=41&type=TOWNHOUSE&listtype=RENT" onClick={onClose}>Townhouse</Link></li>
              <li><Link href="/properties-search?city=41&type=PENTHOUSE&listtype=RENT" onClick={onClose}>Penthouse</Link></li>
              <li><Link href="/properties-search?city=41&type=HOTEL_APARTMENT&listtype=RENT" onClick={onClose}>Studio</Link></li>
              <li><Link href="/properties-search?city=41&type=DUPLEX&listtype=RENT" onClick={onClose}>Duplex</Link></li>
              <li><Link href="/properties-search?city=41&type=COMMERCIAL_BUILDING&listtype=RENT" onClick={onClose}>Commercial</Link></li>
              <li><Link href="/properties-search?city=41&listtype=RENT" onClick={onClose}>See All</Link></li>
            </ul>
          </li>
          <li><a href="#listings-anchor" className="mnm2-close" onClick={onClose}>New Projects</a></li>
          <li><a href="#developers-anchor" className="mnm2-close" onClick={onClose}>Developers</a></li>
          <li className={openSubmenu === 'locations' ? 'has-sub open' : 'has-sub'}>
            <a href="#" onClick={(e) => { e.preventDefault(); setOpenSubmenu(openSubmenu === 'locations' ? null : 'locations'); }}>
              Locations
            </a>
            <ul className="sub-links">
              <li><Link href="/properties-search?regionId=47" onClick={onClose}>Downtown Dubai</Link></li>
              <li><Link href="/properties-search?regionId=50" onClick={onClose}>Dubai Marina</Link></li>
              <li><Link href="/properties-search?regionId=109" onClick={onClose}>Palm Jumeirah</Link></li>
              <li><Link href="/properties-search?regionId=107" onClick={onClose}>Jumeirah Lake Towers</Link></li>
              <li><Link href="/properties-search?regionId=48" onClick={onClose}>Business Bay</Link></li>
              <li><Link href="/properties-search?regionId=108" onClick={onClose}>Jumeirah Village Circle</Link></li>
              <li><Link href="/properties-search?regionId=117" onClick={onClose}>Dubai Hills Estate</Link></li>
            </ul>
          </li>
          <li><a href="#services-anchor" className="mnm2-close" onClick={onClose}>Services</a></li>
          <li className={openSubmenu === 'more' ? 'has-sub open' : 'has-sub'}>
            <a href="#" onClick={(e) => { e.preventDefault(); setOpenSubmenu(openSubmenu === 'more' ? null : 'more'); }}>
              More
            </a>
            <ul className="sub-links">
              <li><a href="#about-us-anchor" className="mnm2-close" onClick={onClose}>About</a></li>
              <li><a href="#contact-us-anchor" className="mnm2-close" onClick={onClose}>Get In Touch</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
