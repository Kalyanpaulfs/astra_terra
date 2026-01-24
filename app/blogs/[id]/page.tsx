'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { useParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { trackNavigation, getPreviousPage } from '@/app/lib/navigation-history';

interface BlogSection {
    heading: string;
    content: string;
    imageUrl?: string;
}

interface BlogPost {
    id?: string;
    title: string;
    slug?: string;
    mainImageUrl: string;
    sections: BlogSection[];
    createdAt: any;
    authorEmail?: string;
    attachmentUrl?: string;
}

export default function BlogDetails() {
    const { id } = useParams(); // 'id' here will capture the slug due to file naming, or actual ID
    const pathname = usePathname();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);

    // Track this page view in navigation history
    useEffect(() => {
        if (pathname) {
            trackNavigation(pathname);
        }
    }, [pathname]);

    // Smart back link - check navigation history first
    const getBackLink = () => {
        const previousPage = getPreviousPage(pathname || '');
        // If previous page was blogs listing, return to it
        if (previousPage && previousPage.includes('/blogs')) {
            return previousPage;
        }
        // Default to blogs listing
        return '/blogs';
    };

    const backLink = getBackLink();

    useEffect(() => {
        async function fetchData() {
            if (!id) return;
            setLoading(true);
            try {
                // 1. Try fetching by slug first
                const blogsRef = collection(db, 'blogs');
                const q = query(blogsRef, where('slug', '==', id));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docData = querySnapshot.docs[0].data() as BlogPost;
                    setBlog({ ...docData, id: querySnapshot.docs[0].id });
                } else {
                    // 2. If no slug match, try fetching by ID (Legacy support)
                    try {
                        const docRef = doc(db, 'blogs', id as string);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            setBlog(docSnap.data() as BlogPost);
                        }
                    } catch (e) {
                        console.log("Not a valid ID either");
                    }
                }

                // 3. Fetch Recent Blogs for sidebar
                const recentQ = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'), limit(3));
                const recentSnap = await getDocs(recentQ);
                const recent: BlogPost[] = [];
                recentSnap.forEach((doc) => {
                    // Don't include current blog in recent list
                    if (doc.id !== id && (querySnapshot.empty || doc.id !== querySnapshot.docs[0].id)) {
                        recent.push({ id: doc.id, ...doc.data() } as BlogPost);
                    }
                });
                setRecentBlogs(recent);

            } catch (error) {
                console.error("Error fetching blog:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="ba-container">
                <div className="ba-loading">
                    <div className="ba-spinner"></div>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <>
                <div className="ba-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
                    <h1 className="ba-title">Blog Post Not Found</h1>
                    <Link href={backLink} style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>Back to Blogs</Link>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="ba-container" style={{ paddingTop: '120px' }}>
                <div style={{ marginBottom: '30px', maxWidth: '1000px', margin: '0 auto 30px auto' }}>
                    <Link href={backLink} className="ba-btn ba-btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', fontSize: '0.9rem', borderRadius: '30px', textDecoration: 'none' }}>
                        ← Back to Blogs
                    </Link>
                </div>
                <article className="ba-article" style={{ maxWidth: '1000px' }}>

                    {/* Header Section */}
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{ color: 'var(--text-gray)', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            {blog.createdAt?.seconds ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'FEATURED INSIGHT'}
                        </div>
                        <h1 className="ba-article-heading" style={{ fontSize: '3rem', lineHeight: 1.1, marginBottom: '2rem' }}>{blog.title}</h1>
                        <div style={{ width: '80px', height: '4px', background: 'var(--accent-gold)', margin: '0 auto' }}></div>
                    </div>

                    {/* Main Image */}
                    {blog.mainImageUrl && (
                        <div style={{ position: 'relative', width: '100%', height: '500px', marginBottom: '4rem', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                            <Image
                                src={blog.mainImageUrl}
                                alt={blog.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                        </div>
                    )}

                    {/* Content Layout: Main + Sidebar */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '60px', alignItems: 'start' }}>
                        {/* Blog Content */}
                        <div className="ba-article-section">
                            {blog.sections?.map((section, index) => (
                                <div key={index} style={{ marginBottom: '4rem' }}>
                                    {section.heading && (
                                        <h2 className="ba-article-heading" style={{ fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem', color: 'white' }}>
                                            {section.heading}
                                        </h2>
                                    )}

                                    {section.imageUrl && (
                                        <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', margin: '2rem 0' }}>
                                            <Image
                                                src={section.imageUrl}
                                                alt={section.heading || "Section image"}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                    )}

                                    <div
                                        className="ba-article-text"
                                        style={{ fontSize: '1.2rem', color: '#d1d5db', lineHeight: '1.8' }}
                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Attachment Download Section */}
                    {blog.attachmentUrl && (
                        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                            <a
                                href={blog.attachmentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="ba-btn"
                                style={{
                                    display: 'inline-block',
                                    textDecoration: 'none',
                                    padding: '12px 30px',
                                    backgroundColor: 'var(--accent-gold)',
                                    color: 'white',
                                    borderRadius: '50px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)'
                                }}
                            >
                                📥 Download Attached File
                            </a>
                        </div>
                    )}

                    <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border-color)' }}>
                        <h3 className="ba-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>More Insights</h3>
                        <div className="ba-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                            {recentBlogs.map(rb => (
                                <Link href={rb.slug ? `/blogs/${rb.slug}` : `/blogs/${rb.id}`} key={rb.id} className="ba-blog-card" style={{ border: 'none', background: 'transparent' }}>
                                    <div style={{ position: 'relative', height: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '15px' }}>
                                        {rb.mainImageUrl ? (
                                            <Image src={rb.mainImageUrl} alt={rb.title} fill style={{ objectFit: 'cover' }} />
                                        ) : (
                                            <div className="ba-no-image"><span>📝</span></div>
                                        )}
                                    </div>
                                    <h4 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>{rb.title}</h4>
                                    <span style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', marginTop: '5px', display: 'block' }}>Read &rarr;</span>
                                </Link>
                            ))}
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <Link href={backLink} className="ba-btn ba-btn-outline" style={{ display: 'inline-block', textDecoration: 'none' }}>
                                Back to All Blogs
                            </Link>
                        </div>
                    </div>

                </article>
            </div>
        </>
    );
}
