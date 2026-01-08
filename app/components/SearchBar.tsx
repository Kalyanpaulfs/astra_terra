'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PriceRangeDropdown from './PriceRangeDropdown';

interface SearchBarProps {
  cities: Record<number, string>;
  propertyTypes: string[];
}

export default function SearchBar({ cities, propertyTypes }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(100000);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [type, setType] = useState(searchParams.get('type') || '');

  const formatText = (text: string) => {
    return text
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (type) params.set('type', type);
    if (minPrice > 100000) params.set('min', minPrice.toString());
    if (maxPrice < 50000000) params.set('max', maxPrice.toString());
    router.push(`/properties-search?${params.toString()}`);
  };

  return (
    <form action="/properties-search" className="ats-container" method="GET" onSubmit={handleSubmit}>
      <div className="ats-nf-container">
        <div className="ats-nfc-col">
          <div className="at-field">
            <div className="atf-label">
              <i className="ph ph-map-pin"></i>
              <span>Emirates &amp; Areas</span>
            </div>
            <div className="control" style={{ width: '180px' }}>
              <div className="select is-normal" style={{ width: '100%' }}>
                <select
                  name="city"
                  style={{ width: '100%' }}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="" disabled>Select Area</option>
                  {Object.entries(cities).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="ats-nfc-col">
          <div className="at-field">
            <div className="atf-label">
              <i className="ph ph-buildings"></i>
              <span>Property Type</span>
            </div>
            <div className="control" style={{ width: '180px' }}>
              <div className="select is-normal" style={{ width: '100%' }}>
                <select
                  name="type"
                  style={{ width: '100%' }}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="" disabled>Select Type</option>
                  {propertyTypes.map((pt) => (
                    <option key={pt} value={pt}>
                      {formatText(pt)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="ats-nfc-col">
          <PriceRangeDropdown
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinChange={setMinPrice}
            onMaxChange={setMaxPrice}
          />
        </div>
        <div className="ats-nfc-col">
          <button type="submit" className="ats-nfc-btn">
            <i className="ph ph-magnifying-glass"></i>
            <span>Find Properties</span>
          </button>
        </div>
      </div>
    </form>
  );
}

