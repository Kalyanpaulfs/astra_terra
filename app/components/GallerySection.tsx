'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export default function GallerySection() {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
    const sectionRef = useRef<HTMLElement>(null);
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

    const images = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        src: `/img/${i + 1}.jpg`,
        alt: `Luxury property ${i + 1}`,
    }));

    // Animation directions for each image (creates visual interest)
    const animationDirections = [
        'from-left',    // 1
        'from-top',     // 2
        'from-right',   // 3
        'from-bottom',  // 4
        'from-left',    // 5
        'from-top',     // 6
        'from-right',   // 7
        'from-bottom',  // 8
        'from-left',    // 9
        'from-top',     // 10
        'from-right',   // 11
        'from-bottom',  // 12
    ];

    // Intersection Observer for scroll-triggered animations - REPEATABLE
    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        const timeouts: NodeJS.Timeout[] = [];

        imageRefs.current.forEach((ref, index) => {
            if (ref) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                // Staggered delay based on index when entering viewport
                                const timeout = setTimeout(() => {
                                    setVisibleImages(prev => new Set([...prev, index + 1]));
                                }, index * 100); // 100ms stagger between each image
                                timeouts.push(timeout);
                            } else {
                                // Reset when leaving viewport - allows animation to replay
                                setVisibleImages(prev => {
                                    const newSet = new Set(prev);
                                    newSet.delete(index + 1);
                                    return newSet;
                                });
                            }
                        });
                    },
                    {
                        threshold: 0.15,
                        rootMargin: '0px 0px -50px 0px'
                    }
                );
                observer.observe(ref);
                observers.push(observer);
            }
        });

        return () => {
            observers.forEach(observer => observer.disconnect());
            timeouts.forEach(timeout => clearTimeout(timeout));
        };
    }, []);

    // Handle escape key to close lightbox
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedImage(null);
            }
        };

        if (selectedImage !== null) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [selectedImage]);

    const openLightbox = (id: number) => {
        setSelectedImage(id);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    const navigateImage = (direction: 'prev' | 'next') => {
        if (selectedImage === null) return;
        const currentIndex = images.findIndex(img => img.id === selectedImage);
        if (direction === 'prev') {
            const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
            setSelectedImage(images[newIndex].id);
        } else {
            const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
            setSelectedImage(images[newIndex].id);
        }
    };

    const selectedImageData = images.find(img => img.id === selectedImage);

    return (
        <>
            <section className="premium-showcase-section" id="gallery" ref={sectionRef}>
                <div className="showcase-container">
                    {/* Section Header */}
                    <div className="showcase-header">
                        <h2 className="showcase-title">Our Exclusive Portfolio</h2>
                        <div className="showcase-divider"></div>
                        <p className="showcase-caption">
                            A curated collection of Dubai&apos;s most prestigious properties
                        </p>
                    </div>

                    {/* Image Grid with scroll animations */}
                    <div className="showcase-grid">
                        {images.map((image, index) => (
                            <div
                                key={image.id}
                                ref={el => { imageRefs.current[index] = el; }}
                                className={`showcase-item showcase-item-${image.id} 
                                    showcase-animate-${animationDirections[index]} 
                                    ${visibleImages.has(image.id) ? 'showcase-visible' : ''}`}
                                onClick={() => openLightbox(image.id)}
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
                                    loading="lazy"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            {selectedImage !== null && selectedImageData && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        {/* Close Button with SVG */}
                        <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        {/* Navigation Arrows with SVG */}
                        <button
                            className="lightbox-nav lightbox-prev"
                            onClick={() => navigateImage('prev')}
                            aria-label="Previous image"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15,18 9,12 15,6"></polyline>
                            </svg>
                        </button>

                        <button
                            className="lightbox-nav lightbox-next"
                            onClick={() => navigateImage('next')}
                            aria-label="Next image"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9,18 15,12 9,6"></polyline>
                            </svg>
                        </button>

                        {/* Image Container */}
                        <div className="lightbox-image-container">
                            <img
                                src={selectedImageData.src}
                                alt={selectedImageData.alt}
                                className="lightbox-image"
                            />
                        </div>

                        {/* Image Counter */}
                        <div className="lightbox-counter">
                            {selectedImage} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
