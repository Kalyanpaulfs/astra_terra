'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePropertyNavigation } from '../lib/use-property-navigation';

interface PropertyCardProps {
  listing: {
    id?: string;
    referenceNumber?: string;
    listingType?: string; // SALE or RENT
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
    sellParam?: {
      bathrooms?: number;
      parking?: number;
    };
    newParam?: {
      bedroomMin?: string;
      bedroomMax?: string;
      minSize?: number;
      maxSize?: number;
      parking?: number;
      handoverTime?: string;
      paymentPlan?: string;
    };
    moreParam?: {
      bathrooms?: number;
      parking?: number;
    };
    agent?: {
      phone?: string;
    };
  };
  variant?: 'featured' | 'horizontal' | 'grid';
  disableWrapper?: boolean;
}

export default function PropertyCard({ listing, variant = 'featured', disableWrapper }: PropertyCardProps) {
  const { storeReferrer } = usePropertyNavigation();

  // Safety check: fallback for missing title
  const title = listing.title || 'Untitled Property';

  // Simple computation - no need for useMemo for this lightweight operation
  const tagList = listing.amenities?.slice(0, 2) || [];
  if (listing.propertyType?.[0]) {
    tagList.push(listing.propertyType[0]);
  }
  const tags = tagList.filter(Boolean);

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

  // Extract data from newParam or fallback to regular fields
  // For NEW properties, prefer newParam bedroom range
  const bedroomDisplay = listing.newParam?.bedroomMin && listing.newParam?.bedroomMax
    ? `${listing.newParam.bedroomMin}-${listing.newParam.bedroomMax}`
    : (listing.bedRooms && listing.bedRooms !== -1 ? listing.bedRooms : '—');

  // For NEW properties, prefer newParam size range
  const sizeDisplay = listing.newParam?.minSize && listing.newParam?.maxSize
    ? `${listing.newParam.minSize}-${listing.newParam.maxSize}`
    : (listing.size && listing.size !== 0 ? listing.size : '—');

  const bathrooms = listing.moreParam?.bathrooms || listing.sellParam?.bathrooms || listing.rentParam?.bathrooms || '—';
  const parking = listing.moreParam?.parking || listing.sellParam?.parking || listing.newParam?.parking || listing.rentParam?.parking || '—';

  // Pluralization helpers
  const pluralize = (count: number | string, singular: string, plural: string) => {
    if (count === '—' || count === '-') return singular;
    const num = typeof count === 'string' ? parseFloat(count) : count;
    return num === 1 ? singular : plural;
  };

  // Determine link URL
  const listType = listing.listingType?.toUpperCase();
  const type = (listType === 'SALE' || listType === 'SELL') ? 'buy' : 'rent';
  // Fallback to 'property' category if type missing, sanitize for URL
  const category = (listing.propertyType?.[0] || 'property').toLowerCase().replace(/\s+/g, '-');
  // Use listing.id strictly for consistent lookup via API
  const linkUrl = `/${type}/${category}/${listing.id}`;

  if (variant === 'horizontal') {
    return (
      <div className="at-property-card-horizontal box mb-5" style={{ width: '100%' }}>
        <div className="columns is-mobile is-variable is-3">
          <div className="column is-3">
            <Link href={linkUrl} className="image" onClick={storeReferrer}>
              <Image
                className="at-pch-img"
                src={listing.photos?.[0] || '/img/prop/1-thumb.webp'}
                alt={title}
                width={140}
                height={140}
                style={{ objectFit: 'cover', width: '100%', borderRadius: '8px' }}
                loading="lazy"
              />
            </Link>
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
                <Link href={linkUrl} className="has-text-grey-darker" onClick={storeReferrer}>
                  {title.length > 70 ? `${title.substring(0, 70)}...` : title}
                </Link>
              </h3>
              <p className="has-text-weight-semibold is-size-6 has-text-success">
                AED {formatPrice(listing.price)}
              </p>
              <p className="is-size-7 has-text-grey mt-1">
                <i className="ph ph-map-pin"></i>
                {listing.community || listing.region}
              </p>
              <ul className="is-flex is-flex-wrap-wrap mt-3 is-size-7">
                <li className="mr-4"><i className="ph ph-bed"></i> {bedroomDisplay} {pluralize(bedroomDisplay, 'Bed', 'Beds')}</li>
                <li className="mr-4"><i className="ph ph-shower"></i> {bathrooms} {pluralize(bathrooms, 'Bath', 'Baths')}</li>
                <li className="mr-4"><i className="ph ph-arrows-out"></i> {sizeDisplay} sqft</li>
                <li><i className="ph ph-car"></i> {parking} {pluralize(parking, 'Parking', 'Parking')}</li>
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

  // Grid variant: Strict grid layout logic
  if (variant === 'grid') {
    return (
      <div className="at-property-card" style={{ height: '100%', minHeight: '480px' }}>
        <Link href={linkUrl} className="at-pc-head" onClick={storeReferrer}>
          <span className="at-pch-highlight">Featured</span>
          <ul className="at-pch-info">
            {tags.map((tag, idx) => (
              <li key={idx}>{formatText(tag)}</li>
            ))}
          </ul>
          <Image
            className="at-pch-img"
            src={listing.photos?.[0] || '/img/prop/1-thumb.webp'}
            alt={title}
            width={600}
            height={400}
            style={{ objectFit: 'cover' }}
            loading="lazy"
          />
        </Link>
        <div className="at-pc-body">
          <div className="at-pcb-info">
            <div className="at-pcbi-price">
              AED {formatPrice(listing.price)}
            </div>
            <Link href={linkUrl} className="at-pcbi-title" onClick={storeReferrer}>
              {title.length > 50 ? `${title.substring(0, 50)}...` : title}
            </Link>
            <div className="at-pcbi-loc">
              <i className="ph-fill ph-map-pin"></i>
              {listing.community || listing.region}
            </div>
          </div>
          <ul className="at-pcb-specs">
            <li><i className="ph ph-bed"></i> <span>{bedroomDisplay} {pluralize(bedroomDisplay, 'Bed', 'Beds')}</span></li>
            <li><i className="ph ph-bathtub"></i> <span>{bathrooms} {pluralize(bathrooms, 'Bath', 'Baths')}</span></li>
            <li><i className="ph ph-square"></i> <span>{sizeDisplay} sqft</span></li>
            <li><i className="ph ph-car"></i> <span>{parking} {pluralize(parking, 'Parking', 'Parking')}</span></li>
          </ul>
        </div>
        <div className="at-pc-footer">
          <Link href={linkUrl} className="at-pcf-btn at-pcf-btn-details" onClick={storeReferrer}>
            <span>View Property Details</span>
          </Link>
        </div>
      </div>
    );
  }

  // Featured card variant (default / carousel)
  const content = (
    <div className="at-property-card">
      <Link href={linkUrl} className="at-pc-head" onClick={storeReferrer}>
        <span className="at-pch-highlight">Featured</span>
        <ul className="at-pch-info">
          {tags.map((tag, idx) => (
            <li key={idx}>{formatText(tag)}</li>
          ))}
        </ul>
        <Image
          className="at-pch-img"
          src={listing.photos?.[0] || '/img/prop/1-thumb.webp'}
          alt={title}
          width={600}
          height={400}
          style={{ objectFit: 'cover' }}
          loading="lazy"
        />
      </Link>
      <div className="at-pc-body">
        <div className="at-pcb-info">
          <div className="at-pcbi-price">
            AED {formatPrice(listing.price)}
          </div>
          <Link href={linkUrl} className="at-pcbi-title" onClick={storeReferrer}>
            {title.length > 50 ? `${title.substring(0, 50)}...` : title}
          </Link>
          <div className="at-pcbi-loc">
            <i className="ph-fill ph-map-pin"></i>
            {listing.community || listing.region}
          </div>
        </div>
        <ul className="at-pcb-specs">
          <li><i className="ph ph-bed"></i> <span>{bedroomDisplay} {pluralize(bedroomDisplay, 'Bed', 'Beds')}</span></li>
          <li><i className="ph ph-bathtub"></i> <span>{bathrooms} {pluralize(bathrooms, 'Bath', 'Baths')}</span></li>
          <li><i className="ph ph-square"></i> <span>{sizeDisplay} sqft</span></li>
          <li><i className="ph ph-car"></i> <span>{parking} {pluralize(parking, 'Parking', 'Parking')}</span></li>
        </ul>
      </div>
      <div className="at-pc-footer">
        <Link href={linkUrl} className="at-pcf-btn at-pcf-btn-details" onClick={storeReferrer}>
          <span>View Property Details</span>
        </Link>
      </div>
    </div>
  );

  if (disableWrapper) {
    return content;
  }

  return (
    <div className="at-pc-wrap">
      {content}
    </div>
  );
}

