import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { getListings } from './api';

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: string;
  priority: number;
  category?: string;
}

function getBaseUrl(): string {
  // In production, use the actual domain
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Production domain
  if (process.env.VERCEL_ENV === 'production') {
    return 'https://www.astraterra.ae';
  }
  
  // Fallback for Vercel preview deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Development fallback
  return 'http://localhost:3000';
}

export async function getSitemapData(): Promise<SitemapEntry[]> {
  const baseUrl = getBaseUrl();
  const currentDate = new Date();
  const entries: SitemapEntry[] = [];

  // Static routes
  entries.push({
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 1.0,
    category: 'Home',
  });
  entries.push({
    url: `${baseUrl}/blogs`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.9,
    category: 'Blogs',
  });
  entries.push({
    url: `${baseUrl}/properties-search`,
    lastModified: currentDate,
    changeFrequency: 'hourly',
    priority: 0.9,
    category: 'Properties',
  });

  // Fetch blogs from Firebase
  try {
    const blogsQuery = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const blogsSnapshot = await getDocs(blogsQuery);
    
    blogsSnapshot.forEach((doc) => {
      const blogData = doc.data();
      const slug = blogData.slug || doc.id;
      const lastModified = blogData.createdAt?.seconds 
        ? new Date(blogData.createdAt.seconds * 1000)
        : currentDate;
      
      entries.push({
        url: `${baseUrl}/blogs/${slug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.8,
        category: 'Blog Post',
      });
    });
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
  }

  // Fetch properties from API
  try {
    // Fetch buy listings
    const listings = await getListings({ 
      size: 1000,
      listingType: 'SELL'
    });
    
    listings.forEach((listing: any) => {
      if (listing.id && listing.propertyType && Array.isArray(listing.propertyType)) {
        listing.propertyType.forEach((type: string) => {
          const normalizedType = type.toLowerCase().replace(/\s+/g, '-');
          entries.push({
            url: `${baseUrl}/buy/${normalizedType}/${listing.id}`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.7,
            category: 'Property - Buy',
          });
        });
      }
    });
    
    // Fetch rental listings
    const rentalListings = await getListings({ 
      size: 1000,
      listingType: 'RENT'
    });
    
    rentalListings.forEach((listing: any) => {
      if (listing.id && listing.propertyType && Array.isArray(listing.propertyType)) {
        listing.propertyType.forEach((type: string) => {
          const normalizedType = type.toLowerCase().replace(/\s+/g, '-');
          entries.push({
            url: `${baseUrl}/rent/${normalizedType}/${listing.id}`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.7,
            category: 'Property - Rent',
          });
        });
      }
    });
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error);
  }

  return entries;
}

