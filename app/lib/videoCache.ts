/**
 * Video caching utility using IndexedDB
 * Caches video blobs locally to improve performance and reduce bandwidth usage
 */

const DB_NAME = 'videoCache';
const DB_VERSION = 1;
const STORE_NAME = 'videos';
const META_STORE_NAME = 'video_meta';
const VIDEO_URL = '/video/Hero_Section.mp4';
const CACHE_KEY = 'hero_video';
const META_KEY = 'hero_video_meta';

interface VideoMeta {
  timestamp: number;
  url: string;
  size: number;
}

// Cache duration: 7 days (in milliseconds)
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

/**
 * Initialize IndexedDB database
 */
function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object store for video blobs
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      
      // Create object store for metadata
      if (!db.objectStoreNames.contains(META_STORE_NAME)) {
        db.createObjectStore(META_STORE_NAME);
      }
    };
  });
}

/**
 * Get cached video blob from IndexedDB
 */
export async function getCachedVideo(): Promise<Blob | null> {
  try {
    const db = await initDB();
    
    // First check metadata
    const meta = await new Promise<VideoMeta | null>((resolve, reject) => {
      const transaction = db.transaction([META_STORE_NAME], 'readonly');
      const store = transaction.objectStore(META_STORE_NAME);
      const request = store.get(META_KEY);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result as VideoMeta | null);
      };
    });

    if (!meta) {
      return null;
    }

    // Check if cache is still valid
    const now = Date.now();
    const age = now - meta.timestamp;

    if (age > CACHE_DURATION) {
      // Cache expired, delete it
      await deleteCachedVideo();
      return null;
    }

    // Check if the cached URL matches current URL
    if (meta.url !== VIDEO_URL) {
      await deleteCachedVideo();
      return null;
    }

    // Get the actual blob
    return new Promise<Blob | null>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(CACHE_KEY);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const blob = request.result as Blob | null;
        if (blob && blob instanceof Blob) {
          console.log('✅ Video loaded from cache! Size:', (blob.size / 1024 / 1024).toFixed(2), 'MB');
          resolve(blob);
        } else {
          resolve(null);
        }
      };
    });
  } catch (error) {
    console.warn('Failed to get cached video:', error);
    return null;
  }
}

/**
 * Cache video blob in IndexedDB
 */
export async function cacheVideo(blob: Blob): Promise<void> {
  try {
    const db = await initDB();
    
    // Store metadata and blob in separate transactions to ensure both succeed
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([META_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(META_STORE_NAME);
      const meta: VideoMeta = {
        timestamp: Date.now(),
        url: VIDEO_URL,
        size: blob.size,
      };
      const request = store.put(meta, META_KEY);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });

    // Store the actual blob
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      // Store blob directly, not wrapped in an object
      const request = store.put(blob, CACHE_KEY);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log('✅ Video cached successfully! Size:', (blob.size / 1024 / 1024).toFixed(2), 'MB');
        resolve();
      };
    });
  } catch (error) {
    console.warn('Failed to cache video:', error);
    // Don't throw - caching failure shouldn't break the app
  }
}

/**
 * Delete cached video from IndexedDB
 */
async function deleteCachedVideo(): Promise<void> {
  try {
    const db = await initDB();
    
    // Delete blob
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(CACHE_KEY);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });

    // Delete metadata
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([META_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(META_STORE_NAME);
      const request = store.delete(META_KEY);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.warn('Failed to delete cached video:', error);
  }
}

/**
 * Fetch video from network
 */
async function fetchVideoFromNetwork(): Promise<Blob> {
  const response = await fetch(VIDEO_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch video: ${response.statusText}`);
  }
  return await response.blob();
}

/**
 * Get video URL (either from cache or network)
 * Returns a blob URL that can be used in video src
 */
export async function getVideoUrl(): Promise<string> {
  // Try to get from cache first
  const cachedBlob = await getCachedVideo();
  if (cachedBlob && cachedBlob instanceof Blob) {
    // Create blob URL from cached blob (the actual MP4 file stored locally)
    console.log('📦 Using cached video from IndexedDB');
    return URL.createObjectURL(cachedBlob);
  }

  // If not cached, fetch from network
  console.log('🌐 Fetching video from network...');
  try {
    const blob = await fetchVideoFromNetwork();
    if (blob && blob instanceof Blob) {
      // Cache the actual MP4 blob for next time
      await cacheVideo(blob);
      // Return blob URL
      return URL.createObjectURL(blob);
    }
    throw new Error('Invalid blob received');
  } catch (error) {
    console.error('Failed to fetch video:', error);
    // Fallback to original URL if fetch fails
    return VIDEO_URL;
  }
}

/**
 * Preload video in background (optional utility)
 */
export async function preloadVideo(): Promise<void> {
  try {
    await getVideoUrl();
  } catch (error) {
    console.warn('Video preload failed:', error);
  }
}

