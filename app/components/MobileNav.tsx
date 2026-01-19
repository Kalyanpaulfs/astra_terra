'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTypes?: string[];
  regions?: Record<string, string>;
}

export default function MobileNav({ isOpen, onClose, propertyTypes = [], regions = {} }: MobileNavProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';

  // Default Types if fetch fails
  const types = propertyTypes.length > 0 ? propertyTypes : ['APARTMENT', 'VILLA', 'TOWNHOUSE', 'PENTHOUSE', 'HOTEL_APARTMENT', 'DUPLEX', 'COMMERCIAL_BUILDING'];

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
        <div className="mnm-header">
          <span className="mnm-close" onClick={onClose}>
            <i className="ph ph-x"></i>
          </span>
        </div>
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
              <i className="ph ph-house-line"></i>
              <span>Buy</span>
              <i className="ph ph-caret-down arrow"></i>
            </a>
            <ul className="sub-links" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {types.map((type) => (
                <li key={type}><Link href={`/properties-search?city=41&type=${encodeURIComponent(type)}&listtype=SELL`} onClick={onClose}>{type.replace(/_/g, ' ')}</Link></li>
              ))}
              <li><Link href="/properties-search?city=41&listtype=SELL" onClick={onClose}>See All</Link></li>
            </ul>
          </li>
          <li className={openSubmenu === 'rent' ? 'has-sub open' : 'has-sub'}>
            <a href="#" onClick={(e) => { e.preventDefault(); setOpenSubmenu(openSubmenu === 'rent' ? null : 'rent'); }}>
              <i className="ph ph-key"></i>
              <span>Rent</span>
              <i className="ph ph-caret-down arrow"></i>
            </a>
            <ul className="sub-links" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {types.map((type) => (
                <li key={type}><Link href={`/properties-search?city=41&type=${encodeURIComponent(type)}&listtype=RENT`} onClick={onClose}>{type.replace(/_/g, ' ')}</Link></li>
              ))}
              <li><Link href="/properties-search?city=41&listtype=RENT" onClick={onClose}>See All</Link></li>
            </ul>
          </li>
          <li>
            <Link href="/properties-search?listtype=NEW" className="mnm2-close" onClick={onClose}>
              <i className="ph ph-buildings"></i>
              <span>New Projects</span>
            </Link>
          </li>
          <li>
            <Link href="/developers" className="mnm2-close" onClick={onClose}>
              <i className="ph ph-users-three"></i>
              <span>Developers</span>
            </Link>
          </li>
          <li className={openSubmenu === 'locations' ? 'has-sub open' : 'has-sub'}>
            <a href="#" onClick={(e) => { e.preventDefault(); setOpenSubmenu(openSubmenu === 'locations' ? null : 'locations'); }}>
              <i className="ph ph-map-pin"></i>
              <span>Locations</span>
              <i className="ph ph-caret-down arrow"></i>
            </a>
            <ul className="sub-links" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {Object.keys(regions).length > 0 ? (
                Object.entries(regions).map(([id, name]) => (
                  <li key={id}><Link href={`/properties-search?regionId=${id}`} onClick={onClose}>{name}</Link></li>
                ))
              ) : (
                <>
                  <li><Link href="/properties-search?regionId=47" onClick={onClose}>Downtown Dubai</Link></li>
                  <li><Link href="/properties-search?regionId=50" onClick={onClose}>Dubai Marina</Link></li>
                </>
              )}
            </ul>
          </li>
          <li>
            <a
              href={isHomePage ? '#services-anchor' : '/#services-anchor'}
              className="mnm2-close"
              onClick={(e) => {
                if (isHomePage) {
                  e.preventDefault();
                  onClose();
                  const element = document.querySelector('#services-anchor');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                } else {
                  // Navigate to home with hash
                  onClose();
                }
              }}
            >
              <i className="ph ph-briefcase"></i>
              <span>Services</span>
            </a>
          </li>
          <li>
            <Link href="/blogs" className="mnm2-close" onClick={onClose}>
              <i className="ph ph-article"></i>
              <span>Blogs</span>
            </Link>
          </li>
          <li>
            <a href="#why-choose-us" className="mnm2-close" onClick={onClose}>
              <i className="ph ph-star"></i>
              <span>Why us ?</span>
            </a>
          </li>
          <li className="list-property-mobile">
            <Link href="/list-your-property" className="mnm2-close list-property-link" onClick={onClose}>
              <i className="ph ph-house-simple"></i>
              <span>List Your Property</span>
            </Link>
          </li>
          <li className={openSubmenu === 'more' ? 'has-sub open' : 'has-sub'}>
            <a href="#" onClick={(e) => { e.preventDefault(); setOpenSubmenu(openSubmenu === 'more' ? null : 'more'); }}>
              <i className="ph ph-dots-three-circle"></i>
              <span>More</span>
              <i className="ph ph-caret-down arrow"></i>
            </a>
            <ul className="sub-links">
              <li><a href="#about-us-anchor" className="mnm2-close" onClick={onClose}>About Us</a></li>
              <li><a href="#contact-us-anchor" className="mnm2-close" onClick={onClose}>Contact Us</a></li>
            </ul>
          </li>
        </ul>

        <div className="mnm-footer">
          <a href="#contact-us-anchor" className="mnm-cta-btn" onClick={onClose}>
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}
