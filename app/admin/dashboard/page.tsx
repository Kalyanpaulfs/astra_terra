'use client';

import { useState, useEffect } from 'react';
import { auth, db, storage } from '@/app/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import RichTextEditor from '../components/RichTextEditor';

interface BlogSection {
    heading: string;
    content: string;
    imageFile?: File | null;
    imageUrl?: string;
}

interface BlogPost {
    id: string;
    title: string;
    createdAt: any;
}

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [blogsLoading, setBlogsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    // Blog Form State
    const [title, setTitle] = useState('');
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [sections, setSections] = useState<BlogSection[]>([
        { heading: '', content: '' }
    ]);
    const [submitting, setSubmitting] = useState(false);

    // Existing Blogs State
    const [existingBlogs, setExistingBlogs] = useState<BlogPost[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Delete Confirmation State
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push('/admin');
            } else {
                setUser(currentUser);
                setLoading(false);
                fetchBlogs();
            }
        });

        return () => unsubscribe();
    }, [router, refreshTrigger]);

    const fetchBlogs = async () => {
        setBlogsLoading(true);
        try {
            const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const fetched: BlogPost[] = [];
            querySnapshot.forEach((doc) => {
                fetched.push({ id: doc.id, ...doc.data() } as BlogPost);
            });
            setExistingBlogs(fetched);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setBlogsLoading(false);
        }
    };

    const generateSlug = (text: string) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const handleAddSection = () => {
        setSections([...sections, { heading: '', content: '' }]);
    };

    const handleRemoveSection = (index: number) => {
        const newSections = [...sections];
        newSections.splice(index, 1);
        setSections(newSections);
    };

    const handleSectionChange = (index: number, field: keyof BlogSection, value: any) => {
        const newSections = [...sections];
        if (field === 'imageFile') {
            // @ts-ignore
            newSections[index].imageFile = value;
        } else {
            // @ts-ignore
            newSections[index][field] = value;
        }
        setSections(newSections);
    };

    const uploadImage = async (file: File) => {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            alert(`File "${file.name}" is too large (>${(file.size / 1024 / 1024).toFixed(1)}MB). Limit is 10MB.`);
            throw new Error('File size exceeds 10MB limit');
        }
        try {
            // Get Signature
            const signRes = await fetch('/api/cloudinary/sign', {
                method: 'POST',
                body: JSON.stringify({ folder: 'blogs' })
            });
            const signData = await signRes.json();
            const { timestamp, signature } = signData;

            // Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '714597318371755');
            formData.append('timestamp', timestamp.toString()); // Convert to string safely
            formData.append('signature', signature);
            formData.append('folder', 'blogs');

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dumt7udjd';
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (!res.ok) {
                console.error("Cloudinary Error:", data);
                throw new Error(data.error?.message || 'Upload failed');
            }
            return data.secure_url || "";
        } catch (e) {
            console.error("Image upload failed.", e);
            return "";
        }
    };

    const uploadAttachment = async (file: File) => {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            alert(`File "${file.name}" is too large. Limit is 10MB.`);
            throw new Error('File size exceeds 10MB limit');
        }
        try {
            const signRes = await fetch('/api/cloudinary/sign', {
                method: 'POST',
                body: JSON.stringify({ folder: 'blog-attachments' })
            });
            const signData = await signRes.json();
            const { timestamp, signature } = signData;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '714597318371755');
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);
            formData.append('folder', 'blog-attachments');

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dumt7udjd';
            // Use auto/upload for generic files (PDF, etc.)
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (!res.ok) {
                console.error("Cloudinary Attachment Error:", data);
                throw new Error(data.error?.message || 'Upload failed');
            }
            return data.secure_url || "";
        } catch (e) {
            console.error("Attachment upload failed.", e);
            throw e; // Rethrow to stop submission
        }
    };

    // New State
    const [attachment, setAttachment] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let mainImageUrl = '';
            if (mainImage) {
                mainImageUrl = await uploadImage(mainImage);
            }

            let attachmentUrl = '';
            // @ts-ignore
            if (attachment) {
                // @ts-ignore
                attachmentUrl = await uploadAttachment(attachment);
            }

            const processedSections = await Promise.all(sections.map(async (section) => {
                let sectionImageUrl = '';
                if (section.imageFile) {
                    sectionImageUrl = await uploadImage(section.imageFile);
                }
                return {
                    heading: section.heading,
                    content: section.content,
                    imageUrl: sectionImageUrl
                };
            }));

            const slug = generateSlug(title);

            await addDoc(collection(db, 'blogs'), {
                title,
                slug,
                mainImageUrl,
                sections: processedSections,
                createdAt: serverTimestamp(),
                authorId: user.uid,
                authorEmail: user.email,
                attachmentUrl: attachmentUrl || null
            });

            alert('Blog posted successfully!');
            setTitle('');
            setMainImage(null);
            setSections([{ heading: '', content: '' }]);
            // @ts-ignore
            setAttachment(null);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Error posting blog:', error);
            alert('Failed to post blog.');
        } finally {
            setSubmitting(false);
        }
    };

    const initiateDelete = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDeleteConfirmId(id);
    };

    const cancelDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDeleteConfirmId(null);
    };

    const confirmExecuteDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await deleteDoc(doc(db, 'blogs', id));
            // Don't alert, just refresh UI for smoother experience, or use a small toast
            setDeleteConfirmId(null);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error deleting document: ", error);
            alert('Failed to delete blog.');
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/admin');
    };

    const [errorModal, setErrorModal] = useState({ show: false, message: '' });

    const showError = (message: string) => {
        setErrorModal({ show: true, message });
    };

    if (loading) return <div className="ba-container"><div className="ba-loading"><div className="ba-spinner"></div></div></div>;

    return (
        <div className="ba-container">
            {errorModal.show && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{
                        backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '12px',
                        maxWidth: '400px', width: '90%', textAlign: 'center',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}>
                        <h3 style={{ color: '#ff4444', marginBottom: '15px', fontSize: '1.2rem' }}>Error</h3>
                        <p style={{ color: '#e0e0e0', marginBottom: '25px', lineHeight: '1.5' }}>
                            {errorModal.message.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
                        </p>
                        <button
                            onClick={() => setErrorModal({ show: false, message: '' })}
                            className="ba-btn"
                            style={{ minWidth: '100px' }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <div className="ba-wrapper">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 className="ba-title" style={{ margin: 0 }}>Admin Dashboard</h1>
                    <button onClick={handleLogout} className="ba-btn ba-btn-outline">Logout</button>
                </div>

                <div className="ba-dashboard-grid" style={{ display: 'grid', gap: '40px' }}>

                    {/* CREATE FORM */}
                    <div className="ba-card">
                        <h2 className="ba-subtitle" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Create New Blog</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="ba-form-group">
                                <label className="ba-label">Blog Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="ba-input"
                                    required
                                />
                            </div>

                            <div className="ba-form-group">
                                <label className="ba-label">Main Thumbnail Image (Optional) <span style={{ fontSize: '0.8rem', color: '#ff9900' }}>(Max 10MB)</span></label>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (file.size > 10 * 1024 * 1024) {
                                                showError(`File is too large!\nMaximum allowed: 10MB\nSelected: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
                                                e.target.value = ''; // Reset
                                                return;
                                            }
                                            setMainImage(file);
                                        }
                                    }}
                                    className="ba-input ba-file-input"
                                    accept="image/*"
                                />
                            </div>

                            <div className="ba-form-group">
                                <label className="ba-label">Upload Attachment (PDF/Doc) (Optional) <span style={{ fontSize: '0.8rem', color: '#ff9900' }}>(Max 10MB)</span></label>
                                <input
                                    type="file"
                                    // @ts-ignore
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (file.size > 10 * 1024 * 1024) {
                                                showError(`File is too large!\nMaximum allowed: 10MB\nSelected: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
                                                e.target.value = '';
                                                return;
                                            }
                                            setAttachment(file);
                                        }
                                    }}
                                    className="ba-input ba-file-input"
                                />
                            </div>

                            <hr style={{ borderColor: 'var(--border-color)', margin: '2rem 0' }} />

                            <div style={{ marginBottom: '2rem' }}>
                                <h3 className="ba-subtitle" style={{ color: 'var(--accent-gold)' }}>Blog Sections</h3>
                                {sections.map((section, index) => (
                                    <div key={index} className="ba-section-card">
                                        {sections.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleRemoveSection(index);
                                                }}
                                                className="ba-btn-delete"
                                                style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', zIndex: 10 }}
                                            >
                                                Remove
                                            </button>
                                        )}
                                        <div className="ba-form-group">
                                            <label className="ba-label">Section Heading</label>
                                            <input
                                                type="text"
                                                value={section.heading}
                                                onChange={(e) => handleSectionChange(index, 'heading', e.target.value)}
                                                className="ba-input"
                                            />
                                        </div>

                                        <div className="ba-form-group">
                                            <label className="ba-label">Content</label>
                                            <RichTextEditor
                                                value={section.content}
                                                onChange={(val) => handleSectionChange(index, 'content', val)}
                                                placeholder="Write section content..."
                                            />
                                        </div>
                                        <div className="ba-form-group">
                                            <label className="ba-label">Section Image (Optional) <span style={{ fontSize: '0.8rem', color: '#ff9900' }}>(Max 10MB)</span></label>
                                            <input
                                                type="file"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        if (file.size > 10 * 1024 * 1024) {
                                                            showError(`File is too large!\nMaximum allowed: 10MB\nSelected: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
                                                            e.target.value = '';
                                                            return;
                                                        }
                                                        handleSectionChange(index, 'imageFile', file);
                                                    }
                                                }}
                                                className="ba-input ba-file-input"
                                                accept="image/*"
                                            />
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={handleAddSection}
                                    className="ba-btn ba-btn-outline"
                                    style={{ width: '100%' }}
                                >
                                    + Add Section
                                </button>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="ba-btn"
                                    style={{ width: '100%', opacity: submitting ? 0.7 : 1 }}
                                >
                                    {submitting ? 'Publishing...' : 'Publish Blog'}
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* MANAGE BLOGS */}
                    <div className="ba-card" style={{ height: 'fit-content' }}>
                        <h2 className="ba-subtitle" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Manage Blogs</h2>
                        {blogsLoading ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <div className="ba-spinner" style={{ width: '30px', height: '30px' }}></div>
                            </div>
                        ) : existingBlogs.length === 0 ? (
                            <p style={{ color: '#888' }}>No blogs found.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {existingBlogs.map(blog => (
                                    <div key={blog.id} style={{
                                        padding: '15px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        background: 'rgba(0,0,0,0.2)',
                                        position: 'relative'
                                    }}>
                                        <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px', color: 'white' }}>{blog.title}</h4>
                                        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '10px' }}>
                                            {blog.createdAt?.seconds ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px', position: 'relative', zIndex: 20 }}>
                                            {/* Logic for custom delete confirmation */}
                                            {deleteConfirmId === blog.id ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        style={{
                                                            cursor: 'pointer',
                                                            zIndex: 30,
                                                            background: 'red',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '5px 10px',
                                                            borderRadius: '4px',
                                                            fontWeight: 'bold'
                                                        }}
                                                        onClick={(e) => confirmExecuteDelete(blog.id, e)}
                                                    >
                                                        Confirm Delete?
                                                    </button>
                                                    <button
                                                        type="button"
                                                        style={{
                                                            cursor: 'pointer',
                                                            zIndex: 30,
                                                            background: 'gray',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '5px 10px',
                                                            borderRadius: '4px'
                                                        }}
                                                        onClick={cancelDelete}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="ba-btn-delete"
                                                    style={{ cursor: 'pointer', zIndex: 30 }}
                                                    onClick={(e) => initiateDelete(blog.id, e)}
                                                >
                                                    Delete
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                className="ba-btn ba-btn-outline"
                                                style={{ cursor: 'pointer', padding: '5px 15px', fontSize: '0.8rem', zIndex: 30 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/admin/edit/${blog.id}`);
                                                }}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
