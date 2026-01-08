'use client';

import Image from 'next/image';
import { useMemo } from 'react';

interface PropertyCardProps {
  listing: {
    title: string;
    price: number;
    photos?: string[];
    amenities?: string[];
    propertyType?: string[];
    community?: string;
    region?: string;
    bedRooms?: number;
    size?: number;
    rentParam?: {
      bathrooms?: number;
      parking?: number;
    };
    agent?: {
      phone?: string;
    };
  };
  variant?: 'featured' | 'horizontal';
}

export default function PropertyCard({ listing, variant = 'featured' }: PropertyCardProps) {
  const tags = useMemo(() => {
    const tagList = listing.amenities?.slice(0, 2) || [];
    if (listing.propertyType?.[0]) {
      tagList.push(listing.propertyType[0]);
    }
    return tagList.filter(Boolean);
  }, [listing.amenities, listing.propertyType]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AE').format(price);
  };

  const formatText = (text: string) => {
    return text
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const phone = listing.agent?.phone?.replace(/\D/g, '') || '';

  if (variant === 'horizontal') {
    return (
      <div className="at-property-card-horizontal box mb-5" style={{ width: '100%' }}>
        <div className="columns is-mobile is-variable is-3">
          <div className="column is-3">
            <a href="#" className="image">
              <Image
                className="at-pch-img"
                src={listing.photos?.[0] || '/img/prop/default-thumb.jpg'}
                alt={listing.title}
                width={140}
                height={140}
                style={{ objectFit: 'cover', width: '100%', borderRadius: '8px' }}
              />
            </a>
          </div>
          <div className="column is-8 is-flex is-flex-direction-column is-justify-content-space-between">
            <div>
              <div className="is-flex is-align-items-center mb-2">
                <span className="tag is-info is-light mr-2">Featured</span>
                {tags.map((tag, idx) => (
                  <span key={idx} className="tag is-light is-rounded mr-1">
                    {formatText(tag)}
                  </span>
                ))}
              </div>
              <h3 className="title is-6 mb-1">
                {listing.title.length > 70 ? `${listing.title.substring(0, 70)}...` : listing.title}
              </h3>
              <p className="has-text-weight-semibold is-size-6 has-text-success">
                AED {formatPrice(listing.price)}
              </p>
              <p className="is-size-7 has-text-grey mt-1">
                <i className="ph ph-map-pin"></i>
                {listing.community || listing.region}
              </p>
              <ul className="is-flex is-flex-wrap-wrap mt-3 is-size-7">
                <li className="mr-4"><i className="ph ph-bed"></i> {listing.bedRooms || '—'}</li>
                <li className="mr-4"><i className="ph ph-shower"></i> {listing.rentParam?.bathrooms || '—'}</li>
                <li className="mr-4"><i className="ph ph-arrows-out"></i> {listing.size || '—'} sq ft</li>
                <li><i className="ph ph-car"></i> {listing.rentParam?.parking || '—'}</li>
              </ul>
            </div>
            <div className="mt-4 is-flex">
              {phone ? (
                <>
                  <a href={`tel:${phone}`} className="button is-small is-link is-light mr-2">
                    <i className="ph-fill ph-phone mr-1"></i> Call
                  </a>
                  <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="button is-small is-success is-light">
                    <i className="ph-fill ph-whatsapp-logo mr-1"></i> WhatsApp
                  </a>
                </>
              ) : (
                <>
                  <button className="button is-small is-link is-light mr-2" disabled>
                    <i className="ph-fill ph-phone mr-1"></i> Unavailable
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Featured card variant
  return (
    <div className="at-pc-wrap">
      <div className="at-property-card">
        <a href="#" className="at-pc-head">
          <span className="at-pch-highlight">Featured</span>
          <ul className="at-pch-info">
            {tags.map((tag, idx) => (
              <li key={idx}>{formatText(tag)}</li>
            ))}
          </ul>
          <Image
            className="at-pch-img"
            src={listing.photos?.[0] || '/img/prop/default-thumb.jpg'}
            alt={listing.title}
            width={400}
            height={300}
            style={{ objectFit: 'cover' }}
          />
        </a>
        <div className="at-pc-body">
          <div className="at-pcb-info">
            <a href="#" className="at-pcbi-title">
              {listing.title.length > 45 ? `${listing.title.substring(0, 45)}...` : listing.title}
            </a>
            <a href="#" className="at-pcbi-price">
              AED {formatPrice(listing.price)}
            </a>
            <a href="#" className="at-pcbi-loc">
              <i className="ph ph-map-pin"></i>
              {listing.community || listing.region}
            </a>
          </div>
          <ul className="at-pcb-specs">
            <li><i className="ph ph-bed"></i> <span>{listing.bedRooms || '—'}</span></li>
            <li><i className="ph ph-shower"></i> <span>{listing.rentParam?.bathrooms || '—'}</span></li>
            <li><i className="ph ph-arrows-out"></i> <span>{listing.size || '—'} sq ft</span></li>
            <li><i className="ph ph-car"></i> <span>{listing.rentParam?.parking || '—'}</span></li>
          </ul>
        </div>
        <div className="at-pc-footer">
          {phone ? (
            <>
              <a href={`tel:${phone}`} className="at-pcf-btn at-pcf-btn1">
                <i className="ph-fill ph-phone"></i>
                <span>Call</span>
              </a>
              <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="at-pcf-btn at-pcf-btn2">
                <i className="ph-fill ph-whatsapp-logo"></i>
                <span>WhatsApp</span>
              </a>
            </>
          ) : (
            <button className="at-pcf-btn at-pcf-btn1" disabled>
              <i className="ph-fill ph-phone"></i>
              <span>Unavailable</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

