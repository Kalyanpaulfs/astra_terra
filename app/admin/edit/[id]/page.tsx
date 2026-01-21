'use client';

import { useState, useEffect } from 'react';
import { auth, db, storage } from '@/app/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import RichTextEditor from '../../components/RichTextEditor';

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
                setExistingAttachmentUrl(data.attachmentUrl || '');
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
            formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);
            formData.append('folder', 'blogs');

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
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
            formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);
            formData.append('folder', 'blog-attachments');

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
            // Use auto/upload for generic files (PDF, etc.)
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (!res.ok) {
                console.error("Attachment Error:", data);
                throw new Error(data.error?.message || 'Upload failed');
            }
            return data.secure_url || "";
        } catch (e) {
            console.error("Attachment upload failed.", e);
            throw e;
        }
    };

    const [existingAttachmentUrl, setExistingAttachmentUrl] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);

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

            let attachmentUrl = existingAttachmentUrl;
            // @ts-ignore
            if (attachment) {
                // @ts-ignore
                attachmentUrl = await uploadAttachment(attachment);
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
                attachmentUrl: attachmentUrl || null,
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
                            <label className="ba-label">Main Thumbnail Image (Optional) <span style={{ fontSize: '0.8rem', color: '#ff9900' }}>(Max 10MB)</span></label>
                            {existingMainImageUrl && (
                                <div style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#888' }}>
                                    Current Image: <a href={existingMainImageUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-gold)' }}>View</a>
                                </div>
                            )}
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
                                        setMainImage(file);
                                    }
                                }}
                                className="ba-input ba-file-input"
                                accept="image/*"
                            />
                        </div>

                        <div className="ba-form-group">
                            <label className="ba-label">Upload Attachment (PDF/Doc) (Optional) <span style={{ fontSize: '0.8rem', color: '#ff9900' }}>(Max 10MB)</span></label>
                            {/* @ts-ignore */}
                            {existingAttachmentUrl && (
                                <div style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#888' }}>
                                    {/* @ts-ignore */}
                                    Current Attachment: <a href={existingAttachmentUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-gold)' }}>Download</a>
                                </div>
                            )}
                            <input
                                type="file"
                                // @ts-ignore
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        // Validate file type
                                        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                                        const fileExtension = file.name.split('.').pop()?.toLowerCase();
                                        const allowedExtensions = ['pdf', 'doc', 'docx'];

                                        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
                                            showError(`Invalid file type!\nOnly PDF and DOC/DOCX files are allowed.`);
                                            e.target.value = '';
                                            return;
                                        }

                                        if (file.size > 10 * 1024 * 1024) {
                                            showError(`File is too large!\nMaximum allowed: 10MB\nSelected: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
                                            e.target.value = '';
                                            return;
                                        }
                                        setAttachment(file);
                                    }
                                }}
                                className="ba-input ba-file-input"
                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
                                        <RichTextEditor
                                            value={section.content}
                                            onChange={(val) => handleSectionChange(index, 'content', val)}
                                            placeholder="Edit section content..."
                                        />
                                    </div>
                                    <div className="ba-form-group">
                                        <label className="ba-label">Section Image (Optional) <span style={{ fontSize: '0.8rem', color: '#ff9900' }}>(Max 10MB)</span></label>
                                        {section.imageUrl && (
                                            <div style={{ marginBottom: '5px', fontSize: '0.8rem', color: '#888' }}>
                                                Has existing image
                                            </div>
                                        )}
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
                                {submitting ? 'Updating...' : 'Update Blog'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
