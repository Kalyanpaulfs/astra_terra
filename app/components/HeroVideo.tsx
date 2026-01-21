'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface HeroVideoProps {
    poster: string;
    webmSrc: string;
    mp4Src: string;
}

export default function HeroVideo({ poster, webmSrc, mp4Src }: HeroVideoProps) {
    const [videoReady, setVideoReady] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Ensure video starts playing if it was ready before component mounted (rare but possible)
    useEffect(() => {
        if (videoRef.current && videoRef.current.readyState >= 3) {
            setVideoReady(true);
            videoRef.current.play().catch(e => console.log("Auto-play blocked or failed:", e));
        }
    }, []);

    const handleCanPlay = () => {
        setVideoReady(true);
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log("Play failed:", e));
        }
    };

    return (
        <div className="video-bg-container" style={{ position: 'absolute', width: '100%', height: '100%', zIndex: -1, overflow: 'hidden' }}>
            {/* Initial Poster Image - Loads instantly with high priority */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                    opacity: videoReady ? 0 : 1,
                    transition: 'opacity 1s ease-in-out',
                    pointerEvents: 'none'
                }}
            >
                <Image
                    src={poster}
                    alt="Hero background poster"
                    fill
                    priority
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                />
            </div>

            {/* Video Background - Fades in once ready */}
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                onCanPlay={handleCanPlay}
                className="video-bg"
                style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    opacity: videoReady ? 1 : 0,
                    transition: 'opacity 1s ease-in-out'
                }}
            >
                <source src={webmSrc} type="video/webm" />
                <source src={mp4Src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
