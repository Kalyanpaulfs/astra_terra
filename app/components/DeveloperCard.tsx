'use client';

import Image from 'next/image';
import Link from 'next/link';

interface DeveloperCardProps {
    developer: {
        name: string;
        logo: string;
        counts: {
            new: number;
            sell: number;
            rent: number;
        };
    };
}

export default function DeveloperCard({ developer }: DeveloperCardProps) {
    const { name, logo, counts } = developer;

    return (
        <Link
            href={`/developers/${encodeURIComponent(name)}`}
            className="at-developer-card"
        >
            <div className="at-dc-logo">
                {logo ? (
                    <Image
                        src={logo}
                        alt={`${name} logo`}
                        width={150}
                        height={80}
                        style={{ objectFit: 'contain' }}
                        onError={(e) => {
                            // Fallback to placeholder on error
                            (e.target as HTMLImageElement).src = '/img/dev/placeholder.png';
                        }}
                    />
                ) : (
                    <div className="at-dc-placeholder">
                        <span>{name.charAt(0)}</span>
                    </div>
                )}
            </div>
            <div className="at-dc-info">
                <h3 className="at-dc-name">{name}</h3>
                <div className="at-dc-counts">
                    <span className="at-dc-count">
                        <strong>New</strong> {counts.new}
                    </span>
                    <span className="at-dc-count">
                        <strong>Sell</strong> {counts.sell}
                    </span>
                    <span className="at-dc-count">
                        <strong>Rent</strong> {counts.rent}
                    </span>
                </div>
            </div>
        </Link>
    );
}
