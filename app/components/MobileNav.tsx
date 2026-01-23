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

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflowY = 'hidden';
    } else {
      timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflowY = '';
      }, 400); // 400ms transition
    }

    return () => {
      clearTimeout(timer);
      document.body.style.overflowY = '';
    };
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div className={`mobile-nav-frame ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="mobile-nav-menu" onClick={(e) => e.stopPropagation()}>
        <div className="mnm-header">
          <span className="mnm-close" onClick={onClose}>
            <i className="ph ph-x"></i>
          </span>
        </div>
        <Image
          className="mnm-logo"
          src="/img/brand.webp"
          alt="astra terrah logo"
          width={150}
          height={40}
          draggable={false}
        />
        <ul className="mnm2-links">
          <li>
            <a href="/buy" className="mnm2-close" onClick={onClose}>
              <i className="ph ph-house-line"></i>
              <span>Buy</span>
            </a>
          </li>
          <li>
            <a href="/rent" className="mnm2-close" onClick={onClose}>
              <i className="ph ph-key"></i>
              <span>Rent</span>
            </a>
          </li>
          <li>
            <a href="/properties-search?listtype=NEW" className="mnm2-close" onClick={onClose}>
              <i className="ph ph-buildings"></i>
              <span>New Projects</span>
            </a>
          </li>
          <li>
            <a href="/developers" className="mnm2-close" onClick={onClose}>
              <i className="ph ph-users-three"></i>
              <span>Developers</span>
            </a>
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
                  onClose();
                }
              }}
            >
              <i className="ph ph-briefcase"></i>
              <span>Services</span>
            </a>
          </li>
          <li>
            <a href="/blogs" className="mnm2-close" onClick={onClose}>
              <i className="ph ph-article"></i>
              <span>Blogs</span>
            </a>
          </li>
          <li>
            <a
              href={isHomePage ? '#why-choose-us' : '/#why-choose-us'}
              className="mnm2-close"
              onClick={(e) => {
                if (isHomePage) {
                  e.preventDefault();
                  onClose();
                  const element = document.querySelector('#why-choose-us');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                } else {
                  onClose();
                }
              }}
            >
              <i className="ph ph-star"></i>
              <span>Why us ?</span>
            </a>
          </li>
          <li className="list-property-mobile">
            <a href="/list-your-property" className="mnm2-close list-property-link" onClick={onClose}>
              <i className="ph ph-house-simple"></i>
              <span>List Your Property</span>
            </a>
          </li>
          <li className={openSubmenu === 'more' ? 'has-sub open' : 'has-sub'}>
            <a href="#" onClick={(e) => { e.preventDefault(); setOpenSubmenu(openSubmenu === 'more' ? null : 'more'); }}>
              <i className="ph ph-dots-three-circle"></i>
              <span>More</span>
              <i className="ph ph-caret-down arrow"></i>
            </a>
            <ul className="sub-links">
              <li><a href="/locations" className="mnm2-close" onClick={onClose}>Locations</a></li>
              <li><a href="/map" className="mnm2-close" onClick={onClose}>Map Search</a></li>

              <li style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: '10px 20px' }}></li>

              <li>
                <a
                  href={isHomePage ? '#about-us-anchor' : '/#about-us-anchor'}
                  className="mnm2-close"
                  onClick={(e) => {
                    if (isHomePage) {
                      e.preventDefault();
                      onClose();
                      const element = document.querySelector('#about-us-anchor');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    } else {
                      onClose();
                    }
                  }}
                >
                  About Us
                </a>
              </li>
              <li><a href="/founder" className="mnm2-close" onClick={onClose}>Founder & CEO</a></li>
              <li>
                <a
                  href={isHomePage ? '#contact-us-anchor' : '/#contact-us-anchor'}
                  className="mnm2-close"
                  onClick={(e) => {
                    if (isHomePage) {
                      e.preventDefault();
                      onClose();
                      const element = document.querySelector('#contact-us-anchor');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    } else {
                      onClose();
                    }
                  }}
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </li>
        </ul>

        <div className="mnm-footer">
          <a
            href={isHomePage ? '#contact-us-anchor' : '/#contact-us-anchor'}
            className="mnm-cta-btn"
            onClick={(e) => {
              if (isHomePage) {
                e.preventDefault();
                onClose();
                const element = document.querySelector('#contact-us-anchor');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              } else {
                onClose();
              }
            }}
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}
