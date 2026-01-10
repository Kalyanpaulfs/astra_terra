'use client';

import PropertyCarousel from './PropertyCarousel';

interface FeaturedSectionProps {
    listings: any[];
}

export default function FeaturedSection({ listings }: FeaturedSectionProps) {
    return (
        <div className="at-featured" id="listings-anchor">
            <div className="atf-header">
                <div className="atfh-shc">
                    <div className="atfh-subheader">Exclusive Collection</div>
                </div>
                <div className="atfh-header">Premier Dubai Properties</div>
                <div className="atfh-hl"></div>
                <p className="atfh-htxt">
                    Discover our curated selection of Dubai's most prestigious properties, each offering unparalleled luxury and sophistication in the world's most dynamic city.
                </p>
            </div>
            <PropertyCarousel listings={listings} />
        </div>
    );
}
