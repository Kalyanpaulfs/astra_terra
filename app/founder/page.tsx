"use client";

import Image from "next/image";
import { useEffect } from "react";
import styles from "./founder.module.css";

export default function FounderPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const experiences = [
        {
            role: "Chief Executive Officer",
            company: "Astra Terra Properties LLC",
            period: "July 2024 – Present",
            location: "Dubai, UAE",
            description: "Leading a dynamic team in revolutionizing the real estate sector. Our mission is to deliver unparalleled property solutions across all real estate segments, driving sustainable growth and ensuring value and success for our clients and stakeholders."
        },
        {
            role: "Real Estate Manager",
            company: "Provident Real Estate",
            period: "Aug 2023 – July 2024",
            location: "Dubai, UAE",
            description: "Focusing on property management, tenant relations, financial and budget management, marketing and leasing, legal compliance, and performance reporting."
        },
        {
            role: "Real Estate Specialist",
            company: "Provident Real Estate",
            period: "July 2023 – Nov 2023",
            location: "Dubai, UAE",
            description: "Implemented strategic sales initiatives and managed high-value client portfolios."
        },
        {
            role: "Team Leader",
            company: "Vivid Properties",
            period: "Jan 2023 – July 2023",
            location: "Dubai, UAE",
            description: "Led a team of agents, optimizing sales processes and enhancing team performance."
        },
        {
            role: "Real Estate Agent",
            company: "Vivid Properties",
            period: "Dec 2021 – May 2023",
            location: "Dubai, UAE",
            description: "Specialized in luxury residential rentals and sales."
        },
        {
            role: "Real Estate Agent",
            company: "Patriot Real Estate",
            period: "Oct 2021 – Dec 2021",
            location: "Dubai, UAE",
            description: "Specializing in rentals and sales of residential and commercial buildings."
        }
    ];

    return (
        <div className={styles.pageContainer}>
            {/* Hero Section: Side-by-Side Layout */}
            <section className={styles.hero}>
                <div className={styles.heroBg}></div>

                <div className={styles.heroContent}>
                    {/* Left: Image */}
                    <div className={styles.profileImageWrapper}>
                        <div className={styles.profileImageContainer}>
                            <Image
                                src="/img/Joseph.jpeg"
                                alt="Joseph Toubia"
                                fill
                                className={styles.profileImage}
                                priority
                            />
                        </div>
                    </div>

                    {/* Right: Bio & Intro */}
                    <div className={styles.heroTextContent}>
                        <h1 className={styles.titleName}>
                            Joseph <span className={styles.goldText}>Toubia</span>
                        </h1>
                        <p className={styles.titleRole}>Founder & CEO</p>
                        <p className={styles.companyName}>ASTRA TERRA PROPERTIES LLC</p>

                        <div className={styles.bioSummary}>
                            <p style={{ marginBottom: '1rem' }}>
                                Joseph Toubia is a Dubai-based luxury real estate advisor and brokerage owner, specializing in high-value residential and investment properties across the city’s most sought-after communities.
                            </p>
                            <p style={{ marginBottom: '1rem' }}>
                                With a strong focus on strategic advisory rather than transactional sales, Joseph works closely with property owners, investors, and international clients to structure deals that align with long-term value, market timing, and asset performance. His approach is data-driven, discreet, and tailored to the expectations of a global clientele.
                            </p>
                            <p style={{ marginBottom: '1rem' }}>
                                Joseph has built his reputation on market knowledge, negotiation strength, and execution, advising on sales, leasing, portfolio structuring, and off-market opportunities. He is particularly active in emerging and established prime areas, guiding clients through Dubai’s dynamic real estate landscape with clarity and confidence.
                            </p>
                            <p>
                                As the founder of his brokerage, Joseph leads with a boutique, quality-first philosophy, prioritizing trust, transparency, and results. His work reflects a deep understanding of both local market mechanics and international investor expectations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience Section: Centered Timeline */}
            <section className={styles.experienceSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Professional Journey</h2>
                    <p className={styles.sectionSubtitle}>A Legacy of Leadership & Growth</p>
                </div>

                <div className={styles.timeline}>
                    {experiences.map((exp, index) => (
                        <div key={index} className={styles.timelineItem}>
                            <div className={styles.timelineDot}></div>

                            <div className={styles.expCard}>
                                <div className={styles.periodBadge}>{exp.period}</div>
                                <h3 className={styles.roleTitle}>{exp.role}</h3>
                                <p className={styles.companyTitle}>{exp.company}</p>

                                {exp.description && (
                                    <p className={styles.description}>{exp.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Education Section */}
            <section className={styles.educationSection}>
                <div className={styles.sectionHeader} style={{ marginBottom: '3rem' }}>
                    <h2 className={styles.sectionTitle} style={{ fontSize: '2rem' }}>Education & Credentials</h2>
                </div>

                <div className={styles.eduContent} style={{ marginBottom: '2rem' }}>
                    <div className={styles.eduIconCircle}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.53,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-70.56-21.48-81.33-33.71A112.55,112.55,0,0,1,32,135.53v-10l96,51.2,96-51.2v10a112.55,112.55,0,0,1-14.67,30.76C198.56,178.52,171.27,200,128,200Zm101.38-96L128,158.19,26.62,104,128,49.93,229.38,104Z"></path></svg>
                    </div>
                    <div className={styles.eduText}>
                        <h3>Bachelor's in Business Administration</h3>
                        <p>Arab Open University - LEBANON</p>
                    </div>
                </div>

                <div className={styles.eduContent}>
                    <div className={styles.eduIconCircle}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,64H216V160H40V64Zm176,128H40v-8H216v8ZM96,96a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,96Zm0,32a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,128Z"></path></svg>
                    </div>
                    <div className={styles.eduText}>
                        <h3>Diploma In Real Estate</h3>
                        <p>Innovation Expertise Real Estate Institute</p>
                    </div>
                </div>
            </section>

            {/* Connect Section */}
            <section className={styles.connectSection}>
                <h2 className={styles.sectionTitle} style={{ marginBottom: '0.5rem', color: '#DEC993' }}>Let's Connect</h2>
                <p style={{ color: '#888', marginBottom: '2rem' }}>Join my professional network</p>

                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '1rem' }}>
                    <a href="https://www.instagram.com/astraterra.ae" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#E1306C', transition: 'transform 0.3s' }} className="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32.04,32.04,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
                        </svg>
                    </a>
                    <a href="https://www.tiktok.com/@astraterraproperties" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: '#FE2C55', transition: 'transform 0.3s' }} className="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M224,72a8,8,0,0,1-8,8,48,48,0,0,1-48,48v48a56,56,0,1,1-56-56,8,8,0,0,1,0,16,40,40,0,1,0,40,40V24a8,8,0,0,1,8-8h40a8,8,0,0,1,8,8v48a8,8,0,0,1-8,8,48.06,48.06,0,0,1,40-48h8A8,8,0,0,1,224,72Z"></path>
                        </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/josephtoubia" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: '#0A66C2', transition: 'transform 0.3s' }} className="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm-8-24a12,12,0,1,1,12-12A12,12,0,0,1,88,88Zm104,48v40a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0v6a36,36,0,0,1,56,18Z"></path>
                        </svg>
                    </a>
                    <a href="https://wa.me/971585580053" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" style={{ color: '#25D366', transition: 'transform 0.3s' }} className="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M187.58,144.84l-32-16a8,8,0,0,0-8,0l-14.4,14.4a108.32,108.32,0,0,1-40.18-40.18l14.4-14.4a8,8,0,0,0,0-8l-16-32a8,8,0,0,0-11-4l-24,12a10.87,10.87,0,0,0-4.32,4c-32,32-6.52,86,30.31,122.84,27,27,65.81,42.54,89.5,30.69a10.87,10.87,0,0,0,4-4.32l12-24A8,8,0,0,0,187.58,144.84Zm-14,40.12L162.77,207c-17.79,8.9-50-5.75-72.77-28.52S62.67,123.49,71.57,105.71l22-11L107,121.2,95.73,132.5a8,8,0,0,0-1.84,8.83,124.28,124.28,0,0,0,40.78,40.78,8,8,0,0,0,8.83-1.84l11.3-11.3,26.49,13.25ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.67-6.54A88,88,0,1,1,128,216Z"></path>
                        </svg>
                    </a>
                    <a href="https://www.youtube.com/@ASTRATERRAPROPERTIESLLC" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={{ color: '#FF0000', transition: 'transform 0.3s' }} className="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M229.44,71.42a25.64,25.64,0,0,0-18-18.1C184.34,46.5,128,46.5,128,46.5s-56.34,0-83.44,6.82a25.64,25.64,0,0,0-18,18.1C19.68,98.5,19.68,128,19.68,128s0,29.5,6.88,56.58a25.64,25.64,0,0,0,18-18.1C71.66,209.5,128,209.5,128,209.5s56.34,0,83.44-6.82a25.64,25.64,0,0,0,18-18.1C236.32,157.5,236.32,128,236.32,128S236.32,98.5,229.44,71.42ZM104,156V100l52,28Z"></path>
                        </svg>
                    </a>
                </div>
            </section>
        </div>
    );
}
