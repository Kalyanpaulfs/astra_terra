'use client';

import React from 'react';

const reviews = [
    {
        name: "Green Biz",
        text: "I had an excellent experience with Astra Terra Properties and would highly recommend their services to anyone looking for a trustworthy and professional real estate team in Dubai. A special mention to Mr. Joseph, who ensured a smooth and transparent process from start to finish. Extremely knowledgeable, responsive, and genuinely caring."
    },
    {
        name: "Mujeeb Rehman",
        text: "Excellent experience with Astra Terra Properties. They were active, results-oriented, and confident about their products. Their inventory was impressive, with a wide range of options. The team was knowledgeable and provided great guidance throughout the process. Highly recommended. 5/5."
    },
    {
        name: "Hatim B",
        text: "Astra Terra is a top-tier real estate agency. Their deep knowledge of the market and insightful advice make them stand out. Professional, reliable, and always helpful. They truly go above and beyond."
    },
    {
        name: "Rebal Z1000",
        text: "An excellent experience with the company. The team was professional and their customer service was outstanding. They helped me find the perfect property quickly and made the entire process smooth and easy. Highly recommended."
    },
    {
        name: "Sima Kameli",
        text: "My experience with Astra Terra was excellent. Very professional, friendly, and helpful. I will definitely recommend them."
    },
    {
        name: "Omar Tahiri",
        text: "Great company. Very professional, organized, and detail-oriented."
    },
    {
        name: "Mehak Usman",
        text: "Amazing, educated, loyal, and highly experienced agent."
    }
];

// Duplicate reviews to create a seamless infinite loop
const infiniteReviews = [...reviews, ...reviews];

export default function WhyChooseUs() {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [itemsToShow, setItemsToShow] = React.useState(3);
    const [isTransitioning, setIsTransitioning] = React.useState(true);

    // Duplicate arrays to facilitate seamless infinite loop
    const extendedReviews = [...reviews, ...reviews, ...reviews];
    const totalOriginal = reviews.length;

    // Responsive items count
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsToShow(1);
            } else {
                setItemsToShow(3);
            }
        };

        // Initial call
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextSlide = React.useCallback(() => {
        // Move forward by the number of visible items
        setCurrentIndex(prev => prev + itemsToShow);
        setIsTransitioning(true);
    }, [itemsToShow]);

    // Auto-rotation
    React.useEffect(() => {
        const interval = setInterval(nextSlide, 4000); // 4 seconds
        return () => clearInterval(interval);
    }, [nextSlide]);

    // Handle the infinite loop reset
    const handleTransitionEnd = () => {
        // If we have scrolled past the second set (safe buffer point), reset instantly to first set
        // The effective index range for the "middle" set is [totalOriginal, 2*totalOriginal)
        // If current index is high enough, we shift back by totalOriginal len to keep in sync
        if (currentIndex >= totalOriginal * 2) {
            setIsTransitioning(false);
            setCurrentIndex(prev => prev - totalOriginal);
            // React will process this state update. 
            // We need to ensure transition is re-enabled in next frame if we want to continue animating later
            // But since next move happens on timer, just setting state is enough?
            // No, if we don't re-enable transitioning, next slide will jump.
            // We can let the next slide re-enable it (it sets setIsTransitioning(true)).
        }
    };

    return (
        <section className="why-us-section" id="why-choose-us">
            <div className="services-container" style={{ overflow: 'hidden' }}>
                <div className="atsv-header">
                    <h2 className="atsvh-title">Why Choose Us</h2>
                    <div className="atsvh-hl"></div>
                    <p className="atsvh-txt">
                        Discover why Astra Terra is the preferred choice for premium real estate in Dubai.
                    </p>
                </div>

                <div className="testimonials-wrapper">
                    <div
                        className="testimonials-track"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
                            transition: isTransitioning ? 'transform 2s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
                        }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {extendedReviews.map((review, index) => (
                            <div key={index} className="testimonial-card">
                                <div className="testimonial-content">
                                    <div className="testimonial-rating">
                                        <i className="ph-fill ph-star"></i>
                                        <i className="ph-fill ph-star"></i>
                                        <i className="ph-fill ph-star"></i>
                                        <i className="ph-fill ph-star"></i>
                                        <i className="ph-fill ph-star"></i>
                                    </div>
                                    <p className="testimonial-text">{review.text}</p>
                                    <div className="testimonial-author">
                                        <span className="author-name">{review.name}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
