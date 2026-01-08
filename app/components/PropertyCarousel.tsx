'use client';

import { useRef, useEffect } from 'react';
import PropertyCard from './PropertyCard';

interface PropertyCarouselProps {
  listings: any[];
}

export default function PropertyCarousel({ listings }: PropertyCarouselProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const cardWidth = 260;
  const gap = 16;
  const step = cardWidth + gap;

  const scrollLeft = () => {
    if (stripRef.current) {
      stripRef.current.scrollBy({ left: -step, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (stripRef.current) {
      stripRef.current.scrollBy({ left: step, behavior: 'smooth' });
    }
  };

  return (
    <div className="atp-strip-wrapper">
      <button
        className="atp-arrow atp-arrow--left"
        aria-label="Prev"
        onClick={scrollLeft}
      >
        <i className="ph ph-caret-left"></i>
      </button>
      <div className="atp-container" ref={stripRef}>
        {listings.length > 0 ? (
          listings.map((listing, idx) => (
            <PropertyCard key={idx} listing={listing} variant="featured" />
          ))
        ) : (
          <p>No listings found.</p>
        )}
      </div>
      <button
        className="atp-arrow atp-arrow--right"
        aria-label="Next"
        onClick={scrollRight}
      >
        <i className="ph ph-caret-right"></i>
      </button>
    </div>
  );
}

