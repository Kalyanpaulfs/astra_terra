'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import MobileNav from './MobileNav';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [closedByClick, setClosedByClick] = useState<Set<string>>(new Set());

  // Close dropdown when route changes
  useEffect(() => {
    setActiveDropdown(null);
    setClosedByClick(new Set());
  }, [pathname]);

  // Determine if we're on homepage
  const isHomePage = pathname === '/';

  // Handler to close dropdown when link is clicked - closes immediately
  const handleLinkClick = (dropdownName: string, e?: React.MouseEvent) => {
    // Stop event propagation to prevent any hover handlers from interfering
    if (e) {
      e.stopPropagation();
    }
    
    // Immediately add class to parent li to force hide via CSS (instant)
    const menuItems = document.querySelectorAll('.custom-nav-menu > li');
    menuItems.forEach((li) => {
      const link = li.querySelector('a[href="#"]');
      if (link && (dropdownName === 'buy' && link.textContent === 'Buy') ||
          (dropdownName === 'rent' && link.textContent === 'Rent') ||
          (dropdownName === 'locations' && link.textContent === 'Locations') ||
          (dropdownName === 'more' && link.textContent === 'More')) {
        li.classList.add('dropdown-closed-by-click');
        // Force hide dropdown immediately via inline style
        const dropdown = li.querySelector('.cnm-mega, .cnm-mega-dd');
        if (dropdown) {
          (dropdown as HTMLElement).style.opacity = '0';
          (dropdown as HTMLElement).style.visibility = 'hidden';
          (dropdown as HTMLElement).style.pointerEvents = 'none';
        }
      }
    });
    
    // Close dropdown immediately - force synchronous update
    setActiveDropdown(null);
    
    // Mark as closed by click - this prevents reopening on hover
    setClosedByClick(prev => {
      const newSet = new Set(prev);
      newSet.add(dropdownName);
      return newSet;
    });
  };

  // Also close dropdown when clicking anywhere inside the dropdown
  const handleDropdownClick = (dropdownName: string) => {
    setActiveDropdown(null);
    setClosedByClick(prev => new Set(prev).add(dropdownName));
  };

  // Handler for mouse enter - only open if not closed by click
  const handleMouseEnter = (dropdownName: string) => {
    // Don't open if it was closed by clicking a link
    if (!closedByClick.has(dropdownName)) {
      setActiveDropdown(dropdownName);
    }
  };

  // Handler for mouse leave - close dropdown and reset closed by click flag
  const handleMouseLeave = (dropdownName: string) => {
    setActiveDropdown(null);
    // Reset the closed-by-click flag when mouse leaves, so it can reopen next time
    setClosedByClick(prev => {
      const newSet = new Set(prev);
      newSet.delete(dropdownName);
      return newSet;
    });
  };

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await fetch('/api/properties?action=meta');
        if (res.ok) {
          const data = await res.json();
          // console.log("Navbar Metadata:", data); // Check for extra fields here
          if (data.propertyTypes) {
            setPropertyTypes(data.propertyTypes);
          }
        }
      } catch (err) {
        console.error("Failed to fetch navbar meta", err);
      }
    };
    fetchMeta();
  }, []);

  // Split property types into two columns for the dropdown
  const midPoint = Math.ceil(propertyTypes.length / 2);
  const leftColumnTypes = propertyTypes.slice(0, midPoint);
  const rightColumnTypes = propertyTypes.slice(midPoint);

  return (
    <>
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className={`custom-navbar ${isHomePage ? 'navbar-home' : 'navbar-other'}`}>
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
            <li
              onMouseEnter={() => handleMouseEnter('buy')}
              onMouseLeave={() => handleMouseLeave('buy')}
              className={closedByClick.has('buy') ? 'dropdown-closed-by-click' : ''}
            >
              <a href="#">Buy</a>
              <div 
                className={`cnm-mega cnm-mega-left ${activeDropdown === 'buy' ? 'is-active' : ''}`}
              >
                <div className="columns">
                  <div className="column">
                    <div className="cnm-mega-content">
                      <h5 className="title is-6 has-text-white">Properties for Sale in Dubai</h5>
                      <div className="cnm-mc-csection">
                        <p className="cnm-mc-title">Properties by Type</p>
                        <div className="columns">
                          <div className="column">
                            <ul className="cnm-mc-plist">
                              {leftColumnTypes.length > 0 ? (
                                leftColumnTypes.map((type) => (
                                  <li key={type}>
                                    <Link 
                                      href={`/properties-search?city=41&type=${encodeURIComponent(type)}&listtype=SELL`} 
                                      onClick={(e) => {
                                        handleLinkClick('buy', e);
                                      }}
                                    >
                                      {type}
                                    </Link>
                                  </li>
                                ))
                              ) : (
                                // Fallback loading/empty state or default items if fetch fails
                                <>
                                  <li><Link href="/properties-search?city=41&type=APARTMENT&listtype=SELL" onClick={(e) => { handleLinkClick('buy', e); }}>Apartment</Link></li>
                                  <li><Link href="/properties-search?city=41&type=VILLA&listtype=SELL" onClick={(e) => { handleLinkClick('buy', e); }}>Villa</Link></li>
                                  <li><Link href="/properties-search?city=41&type=TOWNHOUSE&listtype=SELL" onClick={(e) => { handleLinkClick('buy', e); }}>Townhouse</Link></li>
                                  <li><Link href="/properties-search?city=41&type=PENTHOUSE&listtype=SELL" onClick={(e) => { handleLinkClick('buy', e); }}>Penthouse</Link></li>
                                </>
                              )}
                            </ul>
                          </div>
                          <div className="column">
                            <ul className="cnm-mc-plist">
                              {rightColumnTypes.length > 0 ? (
                                rightColumnTypes.map((type) => (
                                  <li key={type}>
                                    <Link 
                                      href={`/properties-search?city=41&type=${encodeURIComponent(type)}&listtype=SELL`} 
                                      onClick={(e) => {
                                        handleLinkClick('buy', e);
                                      }}
                                    >
                                      {type}
                                    </Link>
                                  </li>
                                ))
                              ) : (
                                <>
                                  <li><Link href="/properties-search?city=41&type=HOTEL_APARTMENT&listtype=SELL" onClick={(e) => { handleLinkClick('buy', e); }}>Studio</Link></li>
                                  <li><Link href="/properties-search?city=41&type=DUPLEX&listtype=SELL" onClick={(e) => { handleLinkClick('buy', e); }}>Duplex</Link></li>
                                  <li><Link href="/properties-search?city=41&type=COMMERCIAL_BUILDING&listtype=SELL" onClick={(e) => { handleLinkClick('buy', e); }}>Commercial</Link></li>
                                </>
                              )}
                              <li><Link href="/properties-search?city=41&listtype=SELL" onClick={(e) => { handleLinkClick('buy', e); }}>See All</Link></li>
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
            <li
              onMouseEnter={() => handleMouseEnter('rent')}
              onMouseLeave={() => handleMouseLeave('rent')}
              className={closedByClick.has('rent') ? 'dropdown-closed-by-click' : ''}
            >
              <a href="#">Rent</a>
              <div 
                className={`cnm-mega cnm-mega-right ${activeDropdown === 'rent' ? 'is-active' : ''}`}
                onClick={(e) => {
                  // Don't close if clicking on a link (let link handle it)
                  if ((e.target as HTMLElement).tagName !== 'A') {
                    handleDropdownClick('rent');
                  }
                }}
              >
                <div className="columns">
                  <div className="column">
                    <div className="cnm-mega-content">
                      <h5 className="title is-6 has-text-white">Properties for Rent in Dubai</h5>
                      <div className="cnm-mc-csection">
                        <p className="cnm-mc-title">Properties by Type</p>
                        <div className="columns">
                          <div className="column">
                            <ul className="cnm-mc-plist">
                              {leftColumnTypes.length > 0 ? (
                                leftColumnTypes.map((type) => (
                                  <li key={type}>
                                    <Link 
                                      href={`/properties-search?city=41&type=${encodeURIComponent(type)}&listtype=RENT`} 
                                      onClick={(e) => {
                                        handleLinkClick('rent', e);
                                      }}
                                    >
                                      {type}
                                    </Link>
                                  </li>
                                ))
                              ) : (
                                <>
                                  <li><Link href="/properties-search?city=41&type=APARTMENT&listtype=RENT" onClick={(e) => { handleLinkClick('rent', e); }}>Apartment</Link></li>
                                  <li><Link href="/properties-search?city=41&type=VILLA&listtype=RENT" onClick={(e) => { handleLinkClick('rent', e); }}>Villa</Link></li>
                                  <li><Link href="/properties-search?city=41&type=TOWNHOUSE&listtype=RENT" onClick={(e) => { handleLinkClick('rent', e); }}>Townhouse</Link></li>
                                  <li><Link href="/properties-search?city=41&type=PENTHOUSE&listtype=RENT" onClick={(e) => { handleLinkClick('rent', e); }}>Penthouse</Link></li>
                                </>
                              )}
                            </ul>
                          </div>
                          <div className="column">
                            <ul className="cnm-mc-plist">
                              {rightColumnTypes.length > 0 ? (
                                rightColumnTypes.map((type) => (
                                  <li key={type}>
                                    <Link 
                                      href={`/properties-search?city=41&type=${encodeURIComponent(type)}&listtype=RENT`} 
                                      onClick={(e) => {
                                        handleLinkClick('rent', e);
                                      }}
                                    >
                                      {type}
                                    </Link>
                                  </li>
                                ))
                              ) : (
                                <>
                                  <li><Link href="/properties-search?city=41&type=HOTEL_APARTMENT&listtype=RENT" onClick={(e) => { handleLinkClick('rent', e); }}>Studio</Link></li>
                                  <li><Link href="/properties-search?city=41&type=DUPLEX&listtype=RENT" onClick={(e) => { handleLinkClick('rent', e); }}>Duplex</Link></li>
                                  <li><Link href="/properties-search?city=41&type=COMMERCIAL_BUILDING&listtype=RENT" onClick={(e) => { handleLinkClick('rent', e); }}>Commercial</Link></li>
                                </>
                              )}
                              <li><Link href="/properties-search?city=41&listtype=RENT" onClick={(e) => { handleLinkClick('rent', e); }}>See All</Link></li>
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
            <li
              onMouseEnter={() => handleMouseEnter('locations')}
              onMouseLeave={() => handleMouseLeave('locations')}
              className={closedByClick.has('locations') ? 'dropdown-closed-by-click' : ''}
            >
              <a href="#">Locations</a>
              <div 
                className={`cnm-mega-dd ${activeDropdown === 'locations' ? 'is-active' : ''}`}
                onClick={(e) => {
                  // Don't close if clicking on a link (let link handle it)
                  if ((e.target as HTMLElement).tagName !== 'A') {
                    handleDropdownClick('locations');
                  }
                }}
              >
                <ul className="dd">
                  <li><Link href="/properties-search?regionId=47" onClick={(e) => { handleLinkClick('locations', e); }}>Downtown Dubai</Link></li>
                  <li><Link href="/properties-search?regionId=50" onClick={(e) => { handleLinkClick('locations', e); }}>Dubai Marina</Link></li>
                  <li><Link href="/properties-search?regionId=109" onClick={(e) => { handleLinkClick('locations', e); }}>Palm Jumeirah</Link></li>
                  <li><Link href="/properties-search?regionId=107" onClick={(e) => { handleLinkClick('locations', e); }}>Jumeirah Lake Towers</Link></li>
                  <li><Link href="/properties-search?regionId=48" onClick={(e) => { handleLinkClick('locations', e); }}>Business Bay</Link></li>
                  <li><Link href="/properties-search?regionId=108" onClick={(e) => { handleLinkClick('locations', e); }}>Jumeirah Village Circle</Link></li>
                  <li><Link href="/properties-search?regionId=117" onClick={(e) => { handleLinkClick('locations', e); }}>Dubai Hills Estate</Link></li>
                </ul>
              </div>
            </li>
            <li><a href="#services-anchor">Services</a></li>
            <li><Link href="/blogs">Blogs</Link></li>
            <li><a href="#why-choose-us">Why Us</a></li>
            <li
              onMouseEnter={() => handleMouseEnter('more')}
              onMouseLeave={() => handleMouseLeave('more')}
              className={closedByClick.has('more') ? 'dropdown-closed-by-click' : ''}
            >
              <a href="#">More</a>
              <div 
                className={`cnm-mega-dd ${activeDropdown === 'more' ? 'is-active' : ''}`}
                onClick={(e) => {
                  // Don't close if clicking on a link (let link handle it)
                  if ((e.target as HTMLElement).tagName !== 'A') {
                    handleDropdownClick('more');
                  }
                }}
              >
                <ul className="dd">
                  <li><a href="#about-us-anchor" onClick={(e) => { handleLinkClick('more', e); }}>About</a></li>
                  <li><a href="#contact-us-anchor" onClick={(e) => { handleLinkClick('more', e); }}>Get In Touch</a></li>
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
