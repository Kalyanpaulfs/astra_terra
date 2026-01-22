'use client';

import React, { useState, useEffect, useCallback } from 'react';

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
        text: "Very serious and very professional. A real pleasure to work with him"
    },
    {
        name: "Mehak Usman",
        text: "Amazing, educated, loyal, and highly experienced agent."
    },
    {
        name: "Lumi.E.",
        text: "Very helpful agent, friendly and good knowledge of the market. We appreciate his efforts and time."
    },
    {
        name: "Eva w",
        text: "Really one of the most professional , trusted and loyable Realtor that I know in 8 years living in the city. Also a very good person. It had been a pleasure to work with you"
    },
    {
        name: "Ahmed Nagui Badawy",
        text: "The best, most decent and high integrity real estate that I ever dealt with inside and outside Dubai."
    },
    {
        name: "Abdalla Atris",
        text: "Joe is superior, he sold my townhouse within 2 weeks. Very professional and helpful."
    },
    {
        name: "noubin",
        text: "such a good agent with behavior and also with prompt response"
    },
    {
        name: "Kamila",
        text: "Joseph is very kind and hard working, he's an incredible listener which made me so comfortable as the places he showed me matched my expectations, he delivered very fast and I got my dream renting place in the busy marina area that I've always dreamed of, I truly recommend Joseph. Kamila Kostka"
    },
    {
        name: "Andrew Kadamani",
        text: "Amazing service . He helped me alot finding the right place to invest. Straight forward and no time wasted."
    },
    {
        name: "Yasaman heidarzad",
        text: "I can say he is very honest , hard working , reliable ✔ Pleasure to have agent like joseph."
    },
    {
        name: "Aziz Al",
        text: "Excellent honest services Very professional and decent Mr. Joseph Toubia was very helpful and caring and excellent negotiator Thanks for your services"
    }
];

export default function WhyChooseUs() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animationClass, setAnimationClass] = useState('entering-left');
    const [isAnimating, setIsAnimating] = useState(false);

    // Function to get the stack position for a card relative to active
    const getStackPosition = useCallback((index: number) => {
        const diff = (index - activeIndex + reviews.length) % reviews.length;
        if (diff === 0) return 0; // Active card
        if (diff === 1 || diff === reviews.length - 1) return 1;
        if (diff === 2 || diff === reviews.length - 2) return 2;
        if (diff === 3 || diff === reviews.length - 3) return 3;
        return -1; // Hidden
    }, [activeIndex]);

    // Auto-advance cards
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isAnimating) {
                setIsAnimating(true);
                // Alternate entry direction
                const nextIndex = (activeIndex + 1) % reviews.length;
                setAnimationClass(nextIndex % 2 === 0 ? 'entering-left' : 'entering-right');

                // Small delay for animation to start
                setTimeout(() => {
                    setActiveIndex(nextIndex);
                    // Reset animating state after animation completes
                    setTimeout(() => {
                        setIsAnimating(false);
                    }, 1200); // Match animation duration
                }, 50);
            }
        }, 4000); // 4 seconds between cards

        return () => clearInterval(interval);
    }, [activeIndex, isAnimating]);

    // Get visible cards (active + 3 stacked behind)
    const getCardClasses = (index: number) => {
        const stackPos = getStackPosition(index);
        const classes = ['testimonial-card'];

        if (stackPos >= 0 && stackPos <= 3) {
            classes.push(`stack-${stackPos}`);
            classes.push('active');
        }

        // Add entry animation to the active card
        if (stackPos === 0 && isAnimating) {
            classes.push(animationClass);
        }

        return classes.join(' ');
    };

    return (
        <section className="why-us-section" id="why-choose-us">
            <div className="services-container" style={{ overflow: 'visible' }}>
                <div className="atsv-header">
                    <h2 className="atsvh-title">Client Success Stories</h2>
                    <div className="atsvh-hl"></div>
                    <p className="atsvh-txt">
                        Real experiences from clients who trusted us with their property journey in Dubai.
                    </p>
                </div>

                <div className="testimonials-wrapper">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className={getCardClasses(index)}
                        >
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
                                    <span className="google-badge">
                                        <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Google Review
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
