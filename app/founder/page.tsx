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
                            <p style={{ marginBottom: '1.5rem' }}>
                                As the CEO and Owner of Astra Terra Properties LLC, I lead a dynamic team in revolutionizing the real estate sector. With a passion for excellence and a commitment to transparency, I drive sustainable growth for our clients.
                            </p>
                            <p>
                                My journey in Dubai's competitive market—from dedicated agent to firm owner—is defined by integrity, strategic vision, and an unwavering focus on delivering value.
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

                <div className={styles.eduContent}>
                    <div className={styles.eduIconCircle}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.53,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-70.56-21.48-81.33-33.71A112.55,112.55,0,0,1,32,135.53v-10l96,51.2,96-51.2v10a112.55,112.55,0,0,1-14.67,30.76C198.56,178.52,171.27,200,128,200Zm101.38-96L128,158.19,26.62,104,128,49.93,229.38,104Z"></path></svg>
                    </div>
                    <div className={styles.eduText}>
                        <h3>Bachelor's in Business Administration</h3>
                        <p>Arab Open University - LEBANON</p>
                    </div>
                </div>
            </section>

            {/* Connect Section */}
            <section className={styles.connectSection}>
                <h2 className={styles.sectionTitle} style={{ marginBottom: '0.5rem', color: '#fff' }}>Let's Connect</h2>
                <p style={{ color: '#888', marginBottom: '2rem' }}>Join my professional network</p>

                <a
                    href="https://www.linkedin.com/in/josephtoubia/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkedinBtn}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm-8-24a12,12,0,1,1,12-12A12,12,0,0,1,88,88Zm104,48v64a8,8,0,0,1-16,0V140c0-4-1.61-8.52-6.59-8.52-5.71,0-7.41,5.22-7.41,9.39v59.13a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0v8.1c3.48-5.32,9.37-8.1,16-8.1,15.65,0,22,12,22,29Z"></path></svg>
                    Connect on LinkedIn
                </a>
            </section>
        </div>
    );
}
