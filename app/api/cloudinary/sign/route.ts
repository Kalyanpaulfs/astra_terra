import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const folder = body.folder || 'blogs';
        const timestamp = Math.round(new Date().getTime() / 1000);

        const signature = cloudinary.utils.api_sign_request({
            timestamp: timestamp,
            folder: folder,
        }, process.env.CLOUDINARY_API_SECRET!);

        return NextResponse.json({ timestamp, signature });
    } catch (error) {
        console.error('Error generating signature:', error);
        return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
    }
}
