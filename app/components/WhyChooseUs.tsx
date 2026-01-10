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
    return (
        <section className="why-us-section" id="why-choose-us">
            <div className="services-container">
                <div className="atsv-header">
                    <h2 className="atsvh-title">Why Choose Us</h2>
                    <div className="atsvh-hl"></div>
                    <p className="atsvh-txt">
                        Discover why Astra Terra is the preferred choice for premium real estate in Dubai.
                    </p>
                </div>

                <div className="testimonials-wrapper">
                    <div className="testimonials-track">
                        {infiniteReviews.map((review, index) => (
                            <div key={index} className="testimonial-card">
                                <div className="testimonial-content">
                                    <div className="testimonial-rating">
                                        <i className="ph-star-fill"></i>
                                        <i className="ph-star-fill"></i>
                                        <i className="ph-star-fill"></i>
                                        <i className="ph-star-fill"></i>
                                        <i className="ph-star-fill"></i>
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
