import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.join(__dirname, '../public/img');
const CONCURRENCY = 4; // Process 4 images at a time

async function getFiles(dir) {
    try {
        const dirents = await fs.readdir(dir, { withFileTypes: true });
        const files = await Promise.all(dirents.map((dirent) => {
            const res = path.resolve(dir, dirent.name);
            return dirent.isDirectory() ? getFiles(res) : res;
        }));
        return files.flat();
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log(`Directory not found: ${dir}`);
            return [];
        }
        throw err;
    }
}

async function processImage(file) {
    const dir = path.dirname(file);
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    const outputFile = path.join(dir, `${name}.webp`);

    try {
        // Check if output file already exists
        try {
            await fs.access(outputFile);
            console.log(`- Skipped (already exists): ${name}.webp`);
            return 0;
        } catch {
            // File doesn't exist, proceed
        }

        const originalStats = await fs.stat(file);

        await sharp(file)
            .webp({ quality: 80 })
            .toFile(outputFile);

        const newStats = await fs.stat(outputFile);
        const fileSavedParams = originalStats.size - newStats.size;
        const savingsPercent = ((originalStats.size - newStats.size) / originalStats.size * 100).toFixed(2);

        console.log(`✓ ${path.relative(TARGET_DIR, file)} -> ${name}.webp (${(newStats.size / 1024).toFixed(1)}KB, -${savingsPercent}%)`);
        return fileSavedParams > 0 ? fileSavedParams : 0;
    } catch (err) {
        console.error(`✗ Error converting ${path.relative(TARGET_DIR, file)}:`, err.message);
        return 0;
    }
}

async function optimizeImages() {
    console.log(`Scanning ${TARGET_DIR} for images...`);

    try {
        const files = await getFiles(TARGET_DIR);

        if (files.length === 0) {
            console.log('No files found.');
            return;
        }

        const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
        console.log(`Found ${imageFiles.length} images to convert.`);

        let savedBytes = 0;

        // Process in chunks
        for (let i = 0; i < imageFiles.length; i += CONCURRENCY) {
            const chunk = imageFiles.slice(i, i + CONCURRENCY);
            const results = await Promise.all(chunk.map(file => processImage(file)));
            savedBytes += results.reduce((a, b) => a + b, 0);
        }

        console.log('\nOptimization Complete!');
        console.log(`Total space saved: ${(savedBytes / 1024 / 1024).toFixed(2)} MB`);

    } catch (error) {
        console.error('Fatal error:', error);
    }
}

optimizeImages();
