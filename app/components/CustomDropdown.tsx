'use client';

import { useState, useRef, useEffect } from 'react';

interface CustomDropdownProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  name: string;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
  name,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;
  
  // Filter out empty value option for display
  const displayOptions = options.filter(opt => opt.value !== '');

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        className={`custom-dropdown-trigger ${isOpen ? 'is-open' : ''} ${value ? 'has-value' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="custom-dropdown-text">{displayText}</span>
        <i className={`ph ph-caret-${isOpen ? 'up' : 'down'}`}></i>
      </button>
      {isOpen && (
        <div className="custom-dropdown-menu" role="listbox">
          {displayOptions.map((option) => (
            <div
              key={option.value}
              className={`custom-dropdown-option ${value === option.value ? 'is-selected' : ''}`}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
              {value === option.value && <i className="ph ph-check"></i>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

