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
  const [regions, setRegions] = useState<Record<string, string>>({});
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detection for sticky navbar transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to format property types (APARTMENT -> Apartment)
  const formatPropertyType = (type: string) => {
    return type
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Developer Branch State for Dropdown Logic
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [closedByClick, setClosedByClick] = useState<Set<string>>(new Set());
  const [justClicked, setJustClicked] = useState<string | null>(null);

  // Close dropdown when route changes
  useEffect(() => {
    setActiveDropdown(null);
    setClosedByClick(new Set());
  }, [pathname]);

  // Determine if we're on homepage
  const isHomePage = pathname === '/';

  // Handle hash scrolling after navigation (for cross-page anchor links)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && isHomePage) {
      // Small delay to ensure the page has rendered
      const timer = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname, isHomePage]);

  // Handler to close dropdown when link is clicked - closes immediately
  const handleLinkClick = (dropdownName: string, e?: React.MouseEvent) => {
    // Stop event propagation to prevent any hover handlers from interfering
    if (e) {
      e.stopPropagation();
    }

    // Set flag to prevent immediate hover reopening
    setJustClicked(dropdownName);

    // Immediately add class to parent li to force hide via CSS (instant)
    const menuItems = document.querySelectorAll('.custom-nav-menu > li');
    menuItems.forEach((li) => {
      const link = li.querySelector('a[href="#"]');
      const linkText = link?.textContent?.trim();
      if (link && linkText && (
        (dropdownName === 'buy' && linkText === 'Buy') ||
        (dropdownName === 'rent' && linkText === 'Rent') ||
        (dropdownName === 'locations' && linkText === 'Locations') ||
        (dropdownName === 'more' && linkText === 'More')
      )) {
        li.classList.add('dropdown-closed-by-click');
        // Force hide dropdown immediately via inline style
        const dropdown = li.querySelector('.cnm-mega, .cnm-mega-dd');
        if (dropdown) {
          (dropdown as HTMLElement).style.opacity = '0';
          (dropdown as HTMLElement).style.visibility = 'hidden';
          (dropdown as HTMLElement).style.pointerEvents = 'none';
          (dropdown as HTMLElement).style.display = 'none';
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

    // Clear the justClicked flag after a short delay to allow navigation
    setTimeout(() => {
      setJustClicked(null);
    }, 300);
  };

  // Also close dropdown when clicking anywhere inside the dropdown
  const handleDropdownClick = (dropdownName: string) => {
    setActiveDropdown(null);
    setClosedByClick(prev => new Set(prev).add(dropdownName));
  };

  // Handler for mouse enter - only open if not closed by click
  const handleMouseEnter = (dropdownName: string) => {
    // Don't open if it was just clicked or closed by clicking a link
    if (justClicked === dropdownName || closedByClick.has(dropdownName)) {
      return;
    }

    // Also check if the CSS class is present (double check)
    const menuItems = document.querySelectorAll('.custom-nav-menu > li');
    let shouldOpen = true;
    menuItems.forEach((li) => {
      const link = li.querySelector('a[href="#"]');
      const linkText = link?.textContent?.trim();
      if (link && linkText && (
        (dropdownName === 'buy' && linkText === 'Buy') ||
        (dropdownName === 'rent' && linkText === 'Rent') ||
        (dropdownName === 'locations' && linkText === 'Locations') ||
        (dropdownName === 'more' && linkText === 'More')
      )) {
        if (li.classList.contains('dropdown-closed-by-click')) {
          shouldOpen = false;
        }
      }
    });

    if (shouldOpen) {
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

    // Also remove the CSS class and reset inline styles when mouse leaves
    const menuItems = document.querySelectorAll('.custom-nav-menu > li');
    menuItems.forEach((li) => {
      const link = li.querySelector('a[href="#"]');
      const linkText = link?.textContent?.trim();
      if (link && linkText && (
        (dropdownName === 'buy' && linkText === 'Buy') ||
        (dropdownName === 'rent' && linkText === 'Rent') ||
        (dropdownName === 'locations' && linkText === 'Locations') ||
        (dropdownName === 'more' && linkText === 'More')
      )) {
        li.classList.remove('dropdown-closed-by-click');
        // Reset inline styles so dropdown can show again
        const dropdown = li.querySelector('.cnm-mega, .cnm-mega-dd');
        if (dropdown) {
          (dropdown as HTMLElement).style.opacity = '';
          (dropdown as HTMLElement).style.visibility = '';
          (dropdown as HTMLElement).style.pointerEvents = '';
          (dropdown as HTMLElement).style.display = '';
        }
      }
    });
  };

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await fetch('/api/properties?action=meta');
        if (res.ok) {
          const data = await res.json();
          if (data.propertyTypes) {
            setPropertyTypes(data.propertyTypes);
          }
          if (data.regions) {
            setRegions(data.regions);
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
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        propertyTypes={propertyTypes}
        regions={regions}
      />
      <div className={`custom-navbar ${isHomePage ? 'navbar-home' : 'navbar-other'}${isScrolled ? ' navbar-scrolled' : ''}`}>
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
            {/* BUY - Keep in main nav */}
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
                                      href={`/properties-search?type=${encodeURIComponent(type)}&listtype=SELL`}
                                      onClick={(e) => {
                                        handleLinkClick('buy', e);
                                      }}
                                    >
                                      {formatPropertyType(type)}
                                    </Link>
                                  </li>
                                ))
                              ) : (
                                // Fallback loading/empty state or default items if fetch fails
                                <>
                                  <li><Link href="/properties-search?type=APARTMENT&listtype=SELL" onClick={(e) => { handleLinkClick('buy', e); }}>Apartment</Link></li>
                                  <li><Link href="/properties-search?type=VILLA&listtype=SELL" onClick={(e) => { handleLinkClick('buy', e); }}>Villa</Link></li>
                                  <li><Link href="/properties-search?type=TOWNHOUSE&listtype=SELL" onClick={(e) => { handleLinkClick('buy', e); }}>Townhouse</Link></li>
                                  <li><Link href="/properties-search?type=PENTHOUSE&listtype=SELL" onClick={(e) => { handleLinkClick('buy', e); }}>Penthouse</Link></li>
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
                                      href={`/properties-search?type=${encodeURIComponent(type)}&listtype=SELL`}
                                      onClick={(e) => {
                                        handleLinkClick('buy', e);
                                      }}
                                    >
                                      {formatPropertyType(type)}
                                    </Link>
                                  </li>
                                ))
                              ) : (
                                <>
                                  <li><Link href="/properties-search?type=HOTEL_APARTMENT&listtype=SELL" onClick={(e) => { handleLinkClick('buy', e); }}>Studio</Link></li>
                                  <li><Link href="/properties-search?type=DUPLEX&listtype=SELL" onClick={(e) => { handleLinkClick('buy', e); }}>Duplex</Link></li>
                                  <li><Link href="/properties-search?type=COMMERCIAL_BUILDING&listtype=SELL" onClick={(e) => { handleLinkClick('buy', e); }}>Commercial</Link></li>
                                </>
                              )}
                              <li><Link href="/properties-search?listtype=SELL" onClick={(e) => { handleLinkClick('buy', e); }}>See All</Link></li>
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

            {/* RENT - Keep in main nav */}
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
                                      href={`/properties-search?type=${encodeURIComponent(type)}&listtype=RENT`}
                                      onClick={(e) => {
                                        handleLinkClick('rent', e);
                                      }}
                                    >
                                      {formatPropertyType(type)}
                                    </Link>
                                  </li>
                                ))
                              ) : (
                                <>
                                  <li><Link href="/properties-search?type=APARTMENT&listtype=RENT" onClick={(e) => { handleLinkClick('rent', e); }}>Apartment</Link></li>
                                  <li><Link href="/properties-search?type=VILLA&listtype=RENT" onClick={(e) => { handleLinkClick('rent', e); }}>Villa</Link></li>
                                  <li><Link href="/properties-search?type=TOWNHOUSE&listtype=RENT" onClick={(e) => { handleLinkClick('rent', e); }}>Townhouse</Link></li>
                                  <li><Link href="/properties-search?type=PENTHOUSE&listtype=RENT" onClick={(e) => { handleLinkClick('rent', e); }}>Penthouse</Link></li>
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
                                      href={`/properties-search?type=${encodeURIComponent(type)}&listtype=RENT`}
                                      onClick={(e) => {
                                        handleLinkClick('rent', e);
                                      }}
                                    >
                                      {formatPropertyType(type)}
                                    </Link>
                                  </li>
                                ))
                              ) : (
                                <>
                                  <li><Link href="/properties-search?type=HOTEL_APARTMENT&listtype=RENT" onClick={(e) => { handleLinkClick('rent', e); }}>Studio</Link></li>
                                  <li><Link href="/properties-search?type=DUPLEX&listtype=RENT" onClick={(e) => { handleLinkClick('rent', e); }}>Duplex</Link></li>
                                  <li><Link href="/properties-search?type=COMMERCIAL_BUILDING&listtype=RENT" onClick={(e) => { handleLinkClick('rent', e); }}>Commercial</Link></li>
                                </>
                              )}
                              <li><Link href="/properties-search?listtype=RENT" onClick={(e) => { handleLinkClick('rent', e); }}>See All</Link></li>
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

            {/* LIST YOUR PROPERTY - Keep in main nav (CTA button) */}
            <li className="nav-cta-item"><Link href="/list-your-property" className="nav-cta-button">
              List Your Property
            </Link>
            </li>

            {/* MORE - Contains all other nav items */}
            <li
              onMouseEnter={() => handleMouseEnter('more')}
              onMouseLeave={() => handleMouseLeave('more')}
              className={closedByClick.has('more') ? 'dropdown-closed-by-click' : ''}
            >
              <a href="#">More</a>
              <div
                className={`cnm-mega cnm-mega-right cnm-mega-more ${activeDropdown === 'more' ? 'is-active' : ''}`}
                onClick={(e) => {
                  // Don't close if clicking on a link (let link handle it)
                  if ((e.target as HTMLElement).tagName !== 'A') {
                    handleDropdownClick('more');
                  }
                }}
              >
                <div className="columns">
                  <div className="column">
                    <div className="cnm-mega-content">
                      <h5 className="title is-6 has-text-white">Explore More</h5>
                      <div className="cnm-mc-csection">
                        <div className="columns">
                          <div className="column">
                            <p className="cnm-mc-title">Properties</p>
                            <ul className="cnm-mc-plist">
                              <li><Link href="/properties-search?listtype=NEW" onClick={(e) => { handleLinkClick('more', e); }}>New Projects</Link></li>
                              <li><Link href="/developers" onClick={(e) => { handleLinkClick('more', e); }}>Developers</Link></li>
                            </ul>
                          </div>
                          <div className="column">
                            <p className="cnm-mc-title">Locations</p>
                            <ul className="cnm-mc-plist" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                              {Object.keys(regions).length > 0 ? (
                                Object.entries(regions).slice(0, 8).map(([id, name]) => (
                                  <li key={id}>
                                    <Link
                                      href={`/properties-search?regionId=${id}`}
                                      onClick={(e) => { handleLinkClick('more', e); }}
                                    >
                                      {name}
                                    </Link>
                                  </li>
                                ))
                              ) : (
                                <>
                                  <li><Link href="/properties-search?regionId=47" onClick={(e) => { handleLinkClick('more', e); }}>Downtown Dubai</Link></li>
                                  <li><Link href="/properties-search?regionId=50" onClick={(e) => { handleLinkClick('more', e); }}>Dubai Marina</Link></li>
                                </>
                              )}
                              <li><Link href="/properties-search" onClick={(e) => { handleLinkClick('more', e); }}>View All Locations</Link></li>
                            </ul>
                          </div>
                          <div className="column">
                            <p className="cnm-mc-title">Resources</p>
                            <ul className="cnm-mc-plist">
                              <li>
                                <a
                                  href={isHomePage ? '#services-anchor' : '/#services-anchor'}
                                  onClick={(e) => {
                                    handleLinkClick('more', e);
                                    if (isHomePage) {
                                      e.preventDefault();
                                      const element = document.querySelector('#services-anchor');
                                      if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                      }
                                    }
                                  }}
                                >
                                  Services
                                </a>
                              </li>
                              <li><Link href="/blogs" onClick={(e) => { handleLinkClick('more', e); }}>Blogs</Link></li>
                              <li><a href="#why-choose-us" onClick={(e) => { handleLinkClick('more', e); }}>Why us ?</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="cnm-mc-csection" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <div className="columns">
                          <div className="column">
                            <p className="cnm-mc-title">Contact</p>
                            <ul className="cnm-mc-plist">
                              <li><a href="#about-us-anchor" onClick={(e) => { handleLinkClick('more', e); }}>About Us</a></li>
                              <li><a href="#contact-us-anchor" onClick={(e) => { handleLinkClick('more', e); }}>Get In Touch</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="cnm-mc-imgs">
                      <Image src="/img/loc/bg2.jpg" alt="Contact" width={400} height={300} />
                      <div className="snip">
                        <h5 className="title is-6 is-white">Get In Touch</h5>
                        <Link href="#contact-us-anchor"><button className="button is-small is-focused">Contact Us</button></Link>
                      </div>
                    </div>
                  </div>
                </div>
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
