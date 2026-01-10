'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CustomDropdown from './CustomDropdown';
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

  const cityOptions = Object.entries(cities).map(([id, name]) => ({
    value: id,
    label: name,
  }));

  const propertyTypeOptions = propertyTypes.map((pt) => ({
    value: pt,
    label: formatText(pt),
  }));

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
    <form action="/properties-search" className="ats-container premium-search-form" method="GET" onSubmit={handleSubmit}>
      <div className="ats-nf-container">
        <div className="ats-nfc-col">
          <div className="at-field premium-field">
            <div className="atf-label premium-label">
              <i className="ph ph-map-pin"></i>
              <span>Emirates &amp; Areas</span>
            </div>
            <CustomDropdown
              name="city"
              options={cityOptions}
              value={city}
              onChange={setCity}
              placeholder="Select Area"
            />
          </div>
        </div>
        <div className="ats-nfc-col">
          <div className="at-field premium-field">
            <div className="atf-label premium-label">
              <i className="ph ph-buildings"></i>
              <span>Property Type</span>
            </div>
            <CustomDropdown
              name="type"
              options={propertyTypeOptions}
              value={type}
              onChange={setType}
              placeholder="Select Type"
            />
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
          <button type="submit" className="ats-nfc-btn premium-search-btn">
            <i className="ph ph-magnifying-glass"></i>
            <span>Find Properties</span>
          </button>
        </div>
      </div>
    </form>
  );
}

