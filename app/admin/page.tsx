'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/admin/dashboard');
        } catch (err: any) {
            console.error(err);
            setError('Invalid credentials. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="ba-login-container">
            <div className="ba-glass-card">
                <h1 className="ba-login-title">Admin Portal</h1>

                {error && <div className="ba-error-msg">{error}</div>}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label className="ba-login-label">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="ba-login-input"
                            placeholder="admin@astra.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="ba-login-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="ba-login-input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="ba-btn"
                        style={{ width: '100%', marginTop: '10px', height: '50px', fontSize: '1rem', letterSpacing: '1px' }}
                    >
                        {loading ? 'Authenticating...' : 'Secure Login'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem', color: '#fff' }}>
                    &copy; Astra Terra Systems
                </div>
            </div>
        </div>
    );
}
