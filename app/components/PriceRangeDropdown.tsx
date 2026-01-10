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

  const formatPriceLabel = (value: number) => {
    const formatted = new Intl.NumberFormat('en-AE', {
      maximumFractionDigits: 0,
    }).format(value);
    return formatted;
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
    <div className="at-field premium-field">
      <div className="atf-label premium-label">
        <i className="ph ph-currency-dollar"></i>
        <span>Price Range (AED)</span>
      </div>
      <div className="premium-price-dropdown" ref={dropdownRef}>
        <button
          type="button"
          className={`premium-price-trigger ${isOpen ? 'is-open' : ''} ${(minPrice > 100000 || maxPrice < 50000000) ? 'has-value' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="premium-price-text">{displayText}</span>
          <i className={`ph ph-caret-${isOpen ? 'up' : 'down'}`}></i>
        </button>
        {isOpen && (
          <div className="premium-price-menu" role="menu">
            <div className="premium-price-content">
              <div className="premium-price-item">
                <div className="ats-fprice premium-price-slider-group">
                  <div className="ats-fpc premium-price-header">
                    <label className="ats-fp-title premium-price-value" htmlFor="priceRange">
                      MIN.AED {formatPriceLabel(localMin)}
                    </label>
                  </div>
                  <div className="at-slider-container premium-slider-container">
                    <input
                      type="range"
                      className="at-pr premium-slider"
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
              <hr className="premium-divider" />
              <div className="premium-price-item">
                <div className="ats-fprice premium-price-slider-group">
                  <div className="ats-fpc premium-price-header">
                    <label className="ats-fp-title premium-price-value" htmlFor="priceRange2">
                      MAX.AED {formatPriceLabel(localMax)}
                    </label>
                  </div>
                  <div className="at-slider-container premium-slider-container">
                    <input
                      type="range"
                      className="at-pr premium-slider"
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
              <hr className="premium-divider" />
              <div className="premium-price-actions">
                <button type="button" className="premium-price-action-btn premium-cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="button" className="premium-price-action-btn premium-save-btn" onClick={handleSave}>
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

