'use client';

import { useState, useEffect } from 'react';
import { auth, db, storage } from '@/app/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface BlogSection {
    heading: string;
    content: string;
    imageFile?: File | null;
    imageUrl?: string;
}

export default function EditBlog() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    // Blog Form State
    const [title, setTitle] = useState('');
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [existingMainImageUrl, setExistingMainImageUrl] = useState('');
    const [sections, setSections] = useState<BlogSection[]>([]);

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push('/admin');
            } else {
                setUser(currentUser);
                fetchBlogData(currentUser);
            }
        });

        return () => unsubscribe();
    }, [router, id]);

    const fetchBlogData = async (currentUser: any) => {
        if (!id) return;
        try {
            const docRef = doc(db, 'blogs', id as string);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setTitle(data.title || '');
                setExistingMainImageUrl(data.mainImageUrl || '');
                setSections(data.sections || []);
            } else {
                alert('Blog not found');
                router.push('/admin/dashboard');
            }
        } catch (error) {
            console.error("Error fetching blog:", error);
            alert('Error fetching blog data');
        } finally {
            setLoading(false);
        }
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
        try {
            const storageRef = ref(storage, `blogs/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            return await getDownloadURL(snapshot.ref);
        } catch (e) {
            console.error("Image upload failed.", e);
            return "";
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let mainImageUrl = existingMainImageUrl;
            if (mainImage) {
                mainImageUrl = await uploadImage(mainImage);
            }

            const processedSections = await Promise.all(sections.map(async (section) => {
                let sectionImageUrl = section.imageUrl || '';

                // If a new file is selected, upload it
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

            const docRef = doc(db, 'blogs', id as string);
            await updateDoc(docRef, {
                title,
                slug,
                mainImageUrl,
                sections: processedSections,
                updatedAt: serverTimestamp(),
            });

            alert('Blog updated successfully!');
            router.push('/admin/dashboard');
        } catch (error) {
            console.error('Error updating blog:', error);
            alert('Failed to update blog.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="ba-container"><div className="ba-loading"><div className="ba-spinner"></div></div></div>;

    return (
        <div className="ba-container">
            <div className="ba-wrapper">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 className="ba-title" style={{ margin: 0 }}>Edit Blog</h1>
                    <button onClick={() => router.push('/admin/dashboard')} className="ba-btn ba-btn-outline">Cancel</button>
                </div>

                <div className="ba-card">
                    <form onSubmit={handleSubmit}>

                        {/* Main Blog Details */}
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
                            <label className="ba-label">Main Thumbnail Image (Optional)</label>
                            {existingMainImageUrl && (
                                <div style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#888' }}>
                                    Current Image: <a href={existingMainImageUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-gold)' }}>View</a>
                                </div>
                            )}
                            <input
                                type="file"
                                onChange={(e) => e.target.files && setMainImage(e.target.files[0])}
                                className="ba-input ba-file-input"
                                accept="image/*"
                            />
                        </div>

                        <hr style={{ borderColor: 'var(--border-color)', margin: '2rem 0' }} />

                        {/* Sections */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 className="ba-subtitle" style={{ color: 'var(--accent-gold)' }}>Blog Sections</h3>
                            {sections.map((section, index) => (
                                <div key={index} className="ba-section-card">

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSection(index)}
                                        className="ba-btn-delete"
                                        style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}
                                    >
                                        Remove
                                    </button>

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
                                        <textarea
                                            value={section.content}
                                            onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                                            className="ba-textarea"
                                            rows={4}
                                        />
                                    </div>
                                    <div className="ba-form-group">
                                        <label className="ba-label">Section Image (Optional)</label>
                                        {section.imageUrl && (
                                            <div style={{ marginBottom: '5px', fontSize: '0.8rem', color: '#888' }}>
                                                Has existing image
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            onChange={(e) => e.target.files && handleSectionChange(index, 'imageFile', e.target.files[0])}
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
                                {submitting ? 'Updating...' : 'Update Blog'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
