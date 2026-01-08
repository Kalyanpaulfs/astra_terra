'use client';

import { useState, useRef, useEffect } from 'react';

interface PriceRangeDropdownProps {
  minPrice: number;
  maxPrice: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

export default function PriceRangeDropdown({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
}: PriceRangeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.floor(parseInt(e.target.value) / 100000) * 100000;
    setLocalMin(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.floor(parseInt(e.target.value) / 100000) * 100000;
    setLocalMax(value);
  };

  const handleSave = () => {
    onMinChange(localMin);
    onMaxChange(localMax);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
    setIsOpen(false);
  };

  const displayText = minPrice === 100000 && maxPrice === 1000000
    ? 'Click to Adjust'
    : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;

  return (
    <div className="at-field">
      <div className="atf-label">
        <i className="ph ph-currency-dollar"></i>
        <span>Price Range (AED)</span>
      </div>
      <div className="dropdown" ref={dropdownRef} id="minmax-dd-frame-new">
        <button
          type="button"
          id="minmax-dd-trig-new"
          className={`button is-normal ${isOpen ? 'is-active' : ''}`}
          style={{ width: '180px' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {displayText}
        </button>
        {isOpen && (
          <div className="dropdown-menu" role="menu" style={{ zIndex: 20 }}>
            <div className="dropdown-content">
              <div className="dropdown-item">
                <div className="ats-fprice">
                  <div className="ats-fpc">
                    <span>Min.</span>
                    <label className="ats-fp-title" htmlFor="priceRange">
                      <span id="priceValue">{formatPrice(localMin)}</span>
                    </label>
                  </div>
                  <div className="at-slider-container">
                    <input
                      type="range"
                      className="at-pr"
                      id="priceRange"
                      min="100000"
                      max="10000000"
                      value={localMin}
                      step="100000"
                      onChange={handleMinChange}
                    />
                  </div>
                </div>
              </div>
              <hr className="dropdown-divider" />
              <div className="dropdown-item">
                <div className="ats-fprice">
                  <div className="ats-fpc">
                    <span>Max.</span>
                    <label className="ats-fp-title" htmlFor="priceRange2">
                      <span id="priceValue2">{formatPrice(localMax)}</span>
                    </label>
                  </div>
                  <div className="at-slider-container">
                    <input
                      type="range"
                      className="at-pr"
                      id="priceRange2"
                      min="200000"
                      max="50000000"
                      value={localMax}
                      step="200000"
                      onChange={handleMaxChange}
                    />
                  </div>
                </div>
              </div>
              <hr className="dropdown-divider" />
              <div className="dropdown-item">
                <button type="button" className="button is-small" onClick={handleCancel}>
                  Cancel
                </button>
                &nbsp;
                <button type="button" className="button is-small is-focused" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

