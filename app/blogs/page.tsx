'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    mainImageUrl: string;
    createdAt: any;
    authorEmail: string;
}

export default function BlogList() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const fetchedBlogs: BlogPost[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedBlogs.push({ id: doc.id, ...doc.data() } as BlogPost);
                });
                setBlogs(fetchedBlogs);
            } catch (error) {
                console.error("Error fetching blogs: ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchBlogs();
    }, []);

    return (
        <>
            <div className="ba-container" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
                <div className="ba-wrapper">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h1 className="ba-title" style={{ fontSize: '3rem' }}>Latest Insights</h1>
                        <div style={{ width: '60px', height: '3px', background: 'var(--accent-gold)', margin: '0 auto 20px' }}></div>
                        <p className="ba-subtitle" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                            Discover the latest trends, market updates, and expert advice on Dubai real estate.
                        </p>
                    </div>

                    {loading ? (
                        <div className="ba-loading">
                            <div className="ba-spinner"></div>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                            <p style={{ fontSize: '1.2rem' }}>No blogs found. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="ba-grid">
                            {blogs.map((blog) => (
                                <Link href={blog.slug ? `/blogs/${blog.slug}` : `/blogs/${blog.id}`} key={blog.id} className="ba-blog-card">
                                    <div style={{ position: 'relative', height: '250px' }}>
                                        {/* Fallback if no image */}
                                        {blog.mainImageUrl ? (
                                            <Image
                                                src={blog.mainImageUrl}
                                                alt={blog.title}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="ba-no-image">
                                                <span style={{ fontSize: '2rem' }}>📝</span>
                                                <span>No Image</span>
                                            </div>
                                        )}
                                        <div style={{
                                            position: 'absolute',
                                            top: '15px',
                                            left: '15px',
                                            background: 'rgba(13, 22, 37, 0.8)',
                                            padding: '5px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            color: 'var(--accent-gold)',
                                            fontWeight: 'bold',
                                            backdropFilter: 'blur(4px)'
                                        }}>
                                            {blog.createdAt?.seconds ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString() : 'Insights'}
                                        </div>
                                    </div>
                                    <div className="ba-blog-content">
                                        <h2 className="ba-blog-title" style={{ fontSize: '1.3rem', lineHeight: '1.4' }}>
                                            {blog.title}
                                        </h2>
                                        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', color: 'var(--accent-gold)', fontSize: '0.9rem', fontWeight: '600' }}>
                                            <span>Read Article</span>
                                            <span style={{ marginLeft: '8px', fontSize: '1.2rem' }}>&rarr;</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
