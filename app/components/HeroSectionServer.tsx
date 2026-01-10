import HeroParallax from './HeroParallax';
import SearchBar from './SearchBar';

interface HeroSectionProps {
    cities: Record<number, string>;
    propertyTypes: string[];
}

export default function HeroSectionServer({ cities, propertyTypes }: HeroSectionProps) {
    return (
        <div className="at-hero">
            <HeroParallax />
            <video
                autoPlay
                muted
                loop
                playsInline
                className="video-bg"
                style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
            >
                <source src="/video/Hero_Section.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="hero-content">
                <div className="hero-header">
                    <div className="hsub-container">
                        <div className="hero-subtitle">Dubai's Premier Real Estate Partner</div>
                    </div>
                    <div className="hero-title">
                        Luxury Living in <br />
                        <span className="gradient-txt">Dubai</span>
                    </div>
                    <div className="hero-subtxt-width">
                        <div className="hero-subtxt">
                            Discover extraordinary properties in the world's most prestigious city.<br />
                            From iconic towers to waterfront palaces.
                        </div>
                    </div>
                </div>
                <SearchBar cities={cities} propertyTypes={propertyTypes} />
            </div>
        </div>
    );
}

