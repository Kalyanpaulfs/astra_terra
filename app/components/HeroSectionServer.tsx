import HeroParallax from './HeroParallax';
import Image from 'next/image';
import SearchBar from './SearchBar';
import HeroVideo from './HeroVideo';

interface HeroSectionProps {
    cities: Record<number, string>;
    propertyTypes: string[];
}

export default function HeroSectionServer({ cities, propertyTypes }: HeroSectionProps) {
    return (
        <div className="at-hero">
            <HeroParallax />
            <HeroVideo
                poster="/video/hero.webp"
                webmSrc="/video/hero.webm"
                mp4Src="/video/hero.mp4"
            />

            <div className="hero-content">
                <div className="hero-header">
                    <div className="hsub-container">
                        <div className="hero-subtitle animate-gradient-bg" style={{ color: '#0D1625' }}>Dubai's Premier Real Estate Partner</div>
                    </div>
                    <div className="hero-title">
                        Luxury Living in <br />
                        <span className="gradient-txt">Dubai</span>
                    </div>
                    {/* <div className="hero-subtxt-width">
                        <div className="hero-subtxt">
                            Discover extraordinary properties in the world's most prestigious city.<br />
                            From iconic towers to waterfront palaces.
                        </div>
                    </div> */}
                </div>
                <SearchBar cities={cities} propertyTypes={propertyTypes} />
            </div>
        </div>
    );
}


