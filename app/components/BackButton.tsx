'use client';

import Link from 'next/link';
import { COLORS } from '../lib/constants';
import { CSSProperties } from 'react';

interface BackButtonProps {
    href: string;
    label?: string;
    className?: string;
    style?: CSSProperties;
}

export default function BackButton({ href, label = 'BACK', className = '', style = {} }: BackButtonProps) {
    return (
        <Link
            href={href}
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '30px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.85rem',
                padding: '8px 20px',
                transition: 'all 0.3s ease',
                letterSpacing: '1px',
                textDecoration: 'none',
                fontWeight: '500',
                ...style, // Merge custom styles
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(222, 201, 147, 0.1)';
                e.currentTarget.style.borderColor = COLORS.DUBAI_GOLD;
                e.currentTarget.style.color = COLORS.DUBAI_GOLD;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = 'white';
            }}
        >
            <i className="ph ph-arrow-left" style={{ fontSize: '1rem' }}></i>
            {label}
        </Link>
    );
}
