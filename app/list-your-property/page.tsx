'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { COLORS } from '../lib/constants';

export default function ListYourPropertyPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const onSubmit = async (data: any) => {
        setStatus(null);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    inquiry_type: 'LIST_PROPERTY',
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit request');
            }

            setSubmitSuccess(true);
            reset();
            // Optional: reset success state after some time if desired, or keep showing the success message
        } catch (error: any) {
            console.error('Submission error:', error);
            setStatus({
                type: 'error',
                message: error.message || 'An error occurred. Please try again.'
            });
        }
    };

    // Shared styles for consistency
    const sectionPadding = { padding: '100px 24px' };
    const containerMaxWidth = { maxWidth: '1200px', margin: '0 auto' };
    const goldAccent = COLORS.GOLD_ACCENT;
    const darkBg = '#0D1625';
    const cardBg = '#111927';
    const inputBg = '#0A0F1A';

    return (
        <main style={{ backgroundColor: darkBg, minHeight: '100vh', color: 'white' }}>

            {/* ══════════════════════════════════════════════════════════════════
                HERO SECTION
            ══════════════════════════════════════════════════════════════════ */}
            <section style={{
                position: 'relative',
                overflow: 'hidden',
                minHeight: '85vh',
                display: 'flex',
                alignItems: 'center',
                marginTop: '80px'
            }}>
                {/* Background Image */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <Image
                        src="/img/hero_luxury_gen.webp"
                        alt="Luxury Property Dubai"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    {/* Gradient overlay for text readability */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(13,22,37,0.3) 0%, rgba(13,22,37,0.6) 50%, rgba(13,22,37,0.95) 100%)'
                    }} />
                </div>

                {/* Hero Content */}
                <div style={{ position: 'relative', zIndex: 10, width: '100%', ...sectionPadding }}>
                    <div style={{ ...containerMaxWidth, textAlign: 'center' }}>
                        <h1 style={{
                            color: '#fff',
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            fontFamily: '"Playfair Display", serif',
                            fontWeight: 600,
                            marginBottom: '24px',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em'
                        }}>
                            List Your Property with <span style={{ color: goldAccent }}>Confidence</span>
                        </h1>

                        <p style={{
                            color: 'rgba(255,255,255,0.85)',
                            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                            maxWidth: '680px',
                            margin: '0 auto 40px',
                            lineHeight: 1.7,
                            fontWeight: 400
                        }}>
                            Unlock the true potential of your real estate assets. Join Dubai's most exclusive portfolio and reach a global network of premium investors.
                        </p>

                        <button
                            onClick={() => document.getElementById('list-property-form')?.scrollIntoView({ behavior: 'smooth' })}
                            style={{
                                backgroundColor: goldAccent,
                                color: darkBg,
                                border: 'none',
                                fontWeight: 600,
                                borderRadius: '2px',
                                padding: '18px 48px',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 24px rgba(197, 162, 101, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = COLORS.DUBAI_GOLD;
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = goldAccent;
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            Start Your Journey
                        </button>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════
                WHY CHOOSE US SECTION
            ══════════════════════════════════════════════════════════════════ */}
            <section style={{ ...sectionPadding, backgroundColor: darkBg }}>
                <div style={containerMaxWidth}>
                    {/* Section Header */}
                    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <span style={{
                            color: goldAccent,
                            textTransform: 'uppercase',
                            letterSpacing: '4px',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            display: 'block',
                            marginBottom: '16px'
                        }}>
                            The Astra Terra Standard
                        </span>
                        <h2 style={{
                            color: '#fff',
                            fontFamily: '"Playfair Display", serif',
                            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                            fontWeight: 500,
                            marginBottom: '20px'
                        }}>
                            Why Choose Us?
                        </h2>
                        <div style={{
                            width: '48px',
                            height: '2px',
                            backgroundColor: goldAccent,
                            margin: '0 auto'
                        }} />
                    </div>

                    {/* Feature Cards Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '24px'
                    }}>
                        {[
                            {
                                icon: "ph-shield-check",
                                title: "Trusted Excellence",
                                desc: "A verifiable legacy of secure, transparent, and high-value transactions."
                            },
                            {
                                icon: "ph-wallet",
                                title: "Transparent Value",
                                desc: "Zero hidden fees. We believe in complete clarity and honest partnerships."
                            },
                            {
                                icon: "ph-star",
                                title: "Concierge Service",
                                desc: "Dedicated experts providing a seamless, white-glove experience from day one."
                            },
                            {
                                icon: "ph-globe-hemisphere-west",
                                title: "Global Exposure",
                                desc: "Strategic marketing to an exclusive network of international investors."
                            }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                style={{
                                    backgroundColor: cardBg,
                                    borderRadius: '8px',
                                    padding: '40px 32px',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    textAlign: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.borderColor = 'rgba(197, 162, 101, 0.4)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {/* Icon */}
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(197, 162, 101, 0.08)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 24px',
                                    border: '1px solid rgba(197, 162, 101, 0.15)'
                                }}>
                                    <i className={`ph ${item.icon}`} style={{ fontSize: '28px', color: goldAccent }}></i>
                                </div>

                                {/* Title */}
                                <h3 style={{
                                    color: '#fff',
                                    fontFamily: '"Playfair Display", serif',
                                    fontSize: '1.35rem',
                                    fontWeight: 500,
                                    marginBottom: '12px'
                                }}>
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p style={{
                                    color: 'rgba(255,255,255,0.6)',
                                    lineHeight: 1.7,
                                    fontSize: '0.95rem'
                                }}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════
                FORM SECTION - FULL WIDTH PREMIUM LAYOUT
            ══════════════════════════════════════════════════════════════════ */}
            <section id="list-property-form" style={{
                ...sectionPadding,
                backgroundColor: '#0A0F1A'
            }}>
                <div style={containerMaxWidth}>
                    {/* Section Header */}
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <span style={{
                            color: goldAccent,
                            textTransform: 'uppercase',
                            letterSpacing: '4px',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            display: 'block',
                            marginBottom: '16px'
                        }}>
                            Get Started
                        </span>
                        <h2 style={{
                            color: '#fff',
                            fontFamily: '"Playfair Display", serif',
                            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                            fontWeight: 500,
                            marginBottom: '16px'
                        }}>
                            Unlock Your Property's <span style={{ color: goldAccent }}>Full Potential</span>
                        </h2>
                        <p style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '1.05rem',
                            maxWidth: '600px',
                            margin: '0 auto',
                            lineHeight: 1.7
                        }}>
                            Connect with our luxury real estate specialists today. Receive a comprehensive valuation and a tailored strategy designed to meet your goals.
                        </p>
                    </div>

                    {/* Benefits List - Horizontal */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '32px',
                        marginBottom: '56px'
                    }}>
                        {[
                            "Complimentary Premium Valuation",
                            "Professional Media Package",
                            "Dedicated Relationship Manager",
                            "Legal & Compliance Support"
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '0.9rem'
                            }}>
                                <i className="ph ph-check-circle" style={{
                                    fontSize: '20px',
                                    color: goldAccent,
                                    marginRight: '10px'
                                }}></i>
                                {item}
                            </div>
                        ))}
                    </div>

                    {/* Form Container - Full Width */}
                    <div style={{
                        backgroundColor: cardBg,
                        borderRadius: '12px',
                        padding: 'clamp(32px, 5vw, 56px)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
                        maxWidth: '900px',
                        margin: '0 auto'
                    }}>
                        {submitSuccess ? (
                            <div style={{ textAlign: 'center', padding: '48px 0' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    backgroundColor: 'rgba(197, 162, 101, 0.1)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 24px',
                                    border: `1px solid ${goldAccent}`
                                }}>
                                    <i className="ph ph-check" style={{ fontSize: '40px', color: goldAccent }}></i>
                                </div>
                                <h3 style={{
                                    color: '#fff',
                                    fontFamily: '"Playfair Display", serif',
                                    fontSize: '1.75rem',
                                    marginBottom: '8px'
                                }}>
                                    Request Received
                                </h3>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>
                                    Our team will be in touch shortly.
                                </p>
                            </div>
                        ) : (
                            <>
                                {status && status.type === 'error' && (
                                    <div style={{
                                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                                        border: '1px solid #e74c3c',
                                        color: '#e74c3c',
                                        padding: '16px',
                                        borderRadius: '4px',
                                        marginBottom: '24px',
                                        textAlign: 'center'
                                    }}>
                                        {status.message}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* Row 1: Name + Email */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '24px',
                                        marginBottom: '24px'
                                    }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                color: 'rgba(255,255,255,0.5)',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                letterSpacing: '1.5px',
                                                textTransform: 'uppercase',
                                                marginBottom: '10px'
                                            }}>
                                                Name
                                            </label>
                                            <input
                                                {...register('name', { required: true })}
                                                style={{
                                                    width: '100%',
                                                    backgroundColor: inputBg,
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '4px',
                                                    padding: '16px 18px',
                                                    color: '#fff',
                                                    fontSize: '1rem',
                                                    outline: 'none',
                                                    transition: 'border-color 0.2s'
                                                }}
                                                placeholder="Your Full Name"
                                                onFocus={(e) => e.currentTarget.style.borderColor = goldAccent}
                                                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                                            />
                                            {errors.name && <p style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '6px' }}>Required</p>}
                                        </div>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                color: 'rgba(255,255,255,0.5)',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                letterSpacing: '1.5px',
                                                textTransform: 'uppercase',
                                                marginBottom: '10px'
                                            }}>
                                                Email ID
                                            </label>
                                            <input
                                                {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                                                style={{
                                                    width: '100%',
                                                    backgroundColor: inputBg,
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '4px',
                                                    padding: '16px 18px',
                                                    color: '#fff',
                                                    fontSize: '1rem',
                                                    outline: 'none',
                                                    transition: 'border-color 0.2s'
                                                }}
                                                placeholder="you@example.com"
                                                type="email"
                                                onFocus={(e) => e.currentTarget.style.borderColor = goldAccent}
                                                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                                            />
                                            {errors.email && <p style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '6px' }}>Valid email required</p>}
                                        </div>
                                    </div>

                                    {/* Row 2: Phone + Property Address */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '24px',
                                        marginBottom: '24px'
                                    }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                color: 'rgba(255,255,255,0.5)',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                letterSpacing: '1.5px',
                                                textTransform: 'uppercase',
                                                marginBottom: '10px'
                                            }}>
                                                Phone Number
                                            </label>
                                            <input
                                                {...register('phone', { required: true })}
                                                style={{
                                                    width: '100%',
                                                    backgroundColor: inputBg,
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '4px',
                                                    padding: '16px 18px',
                                                    color: '#fff',
                                                    fontSize: '1rem',
                                                    outline: 'none',
                                                    transition: 'border-color 0.2s'
                                                }}
                                                placeholder="+971 50 000 0000"
                                                type="tel"
                                                onFocus={(e) => e.currentTarget.style.borderColor = goldAccent}
                                                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                                            />
                                            {errors.phone && <p style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '6px' }}>Required</p>}
                                        </div>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                color: 'rgba(255,255,255,0.5)',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                letterSpacing: '1.5px',
                                                textTransform: 'uppercase',
                                                marginBottom: '10px'
                                            }}>
                                                Property Address
                                            </label>
                                            <input
                                                {...register('propertyAddress', { required: true })}
                                                style={{
                                                    width: '100%',
                                                    backgroundColor: inputBg,
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '4px',
                                                    padding: '16px 18px',
                                                    color: '#fff',
                                                    fontSize: '1rem',
                                                    outline: 'none',
                                                    transition: 'border-color 0.2s'
                                                }}
                                                placeholder="Building, Area, City"
                                                onFocus={(e) => e.currentTarget.style.borderColor = goldAccent}
                                                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                                            />
                                            {errors.propertyAddress && <p style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '6px' }}>Required</p>}
                                        </div>
                                    </div>

                                    {/* Row 3: Property Type + Property Purpose */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '24px',
                                        marginBottom: '24px'
                                    }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                color: 'rgba(255,255,255,0.5)',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                letterSpacing: '1.5px',
                                                textTransform: 'uppercase',
                                                marginBottom: '10px'
                                            }}>
                                                Property Type
                                            </label>
                                            <select
                                                {...register('propertyType')}
                                                style={{
                                                    width: '100%',
                                                    backgroundColor: inputBg,
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '4px',
                                                    padding: '16px 18px',
                                                    color: '#fff',
                                                    fontSize: '1rem',
                                                    outline: 'none',
                                                    cursor: 'pointer',
                                                    appearance: 'none',
                                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23C5A265' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'right 16px center'
                                                }}
                                            >
                                                <option value="apartment">Apartment</option>
                                                <option value="penthouse">Penthouse</option>
                                                <option value="township">Township</option>
                                                <option value="villa">Villa</option>
                                                <option value="plots">Plots</option>
                                                <option value="office">Office</option>
                                                <option value="shop">Shop</option>
                                                <option value="short-term">Short-term</option>
                                                <option value="duplex">Duplex</option>
                                                <option value="rental">Rental</option>
                                                <option value="whole-building">Whole Building</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                color: 'rgba(255,255,255,0.5)',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                letterSpacing: '1.5px',
                                                textTransform: 'uppercase',
                                                marginBottom: '10px'
                                            }}>
                                                Property Purpose
                                            </label>
                                            <select
                                                {...register('propertyPurpose')}
                                                style={{
                                                    width: '100%',
                                                    backgroundColor: inputBg,
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '4px',
                                                    padding: '16px 18px',
                                                    color: '#fff',
                                                    fontSize: '1rem',
                                                    outline: 'none',
                                                    cursor: 'pointer',
                                                    appearance: 'none',
                                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23C5A265' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'right 16px center'
                                                }}
                                            >
                                                <option value="for-sale">For Sale</option>
                                                <option value="for-rent">For Rent</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Row 4: Bedroom (full width) */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <label style={{
                                            display: 'block',
                                            color: 'rgba(255,255,255,0.5)',
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            letterSpacing: '1.5px',
                                            textTransform: 'uppercase',
                                            marginBottom: '10px'
                                        }}>
                                            Bedroom
                                        </label>
                                        <select
                                            {...register('bedroom')}
                                            style={{
                                                width: '100%',
                                                backgroundColor: inputBg,
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '4px',
                                                padding: '16px 18px',
                                                color: '#fff',
                                                fontSize: '1rem',
                                                outline: 'none',
                                                cursor: 'pointer',
                                                appearance: 'none',
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23C5A265' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 16px center'
                                            }}
                                        >
                                            <option value="studio">Studio</option>
                                            <option value="1-bedroom">1 Bedroom</option>
                                            <option value="2-bedroom">2 Bedroom</option>
                                            <option value="3-bedroom">3 Bedroom</option>
                                            <option value="4-bedroom">4 Bedroom</option>
                                            <option value="5-bedroom">5 Bedroom</option>
                                            <option value="6-plus-bedroom">6+ Bedroom</option>
                                        </select>
                                    </div>

                                    {/* Row 5: Message (full width textarea) */}
                                    <div style={{ marginBottom: '32px' }}>
                                        <label style={{
                                            display: 'block',
                                            color: 'rgba(255,255,255,0.5)',
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            letterSpacing: '1.5px',
                                            textTransform: 'uppercase',
                                            marginBottom: '10px'
                                        }}>
                                            Message
                                        </label>
                                        <textarea
                                            {...register('message')}
                                            style={{
                                                width: '100%',
                                                backgroundColor: inputBg,
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '4px',
                                                padding: '16px 18px',
                                                color: '#fff',
                                                fontSize: '1rem',
                                                outline: 'none',
                                                transition: 'border-color 0.2s',
                                                minHeight: '120px',
                                                resize: 'vertical'
                                            }}
                                            placeholder="Tell us more about your property..."
                                            onFocus={(e) => e.currentTarget.style.borderColor = goldAccent}
                                            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        style={{
                                            width: '100%',
                                            backgroundColor: goldAccent,
                                            color: darkBg,
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '18px',
                                            fontSize: '0.9rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '2px',
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                            opacity: isSubmitting ? 0.7 : 1,
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSubmitting) {
                                                e.currentTarget.style.backgroundColor = COLORS.DUBAI_GOLD;
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSubmitting) {
                                                e.currentTarget.style.backgroundColor = goldAccent;
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }
                                        }}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Details'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
