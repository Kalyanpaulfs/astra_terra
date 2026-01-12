import { MetadataRoute } from 'next';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './lib/firebase';
import { getListings, getMetadata } from './lib/api';

// Revalidate sitemap every hour
export const revalidate = 3600;

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const currentDate = new Date();
  
  // Static routes with high priority
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/properties-search`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ];

  // Fetch blogs from Firebase
  const blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogsQuery = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const blogsSnapshot = await getDocs(blogsQuery);
    
    blogsSnapshot.forEach((doc) => {
      const blogData = doc.data();
      const slug = blogData.slug || doc.id;
      const lastModified = blogData.createdAt?.seconds 
        ? new Date(blogData.createdAt.seconds * 1000)
        : currentDate;
      
      blogRoutes.push({
        url: `${baseUrl}/blogs/${slug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
  }

  // Fetch properties from API
  const propertyRoutes: MetadataRoute.Sitemap = [];
  try {
    // Get metadata to understand property types
    const meta = await getMetadata();
    const propertyTypes = meta.propertyTypes || [];
    
    // Fetch active listings (limit to reasonable number for sitemap)
    const listings = await getListings({ 
      size: 1000, // Adjust based on your needs
      listingType: 'SELL'
    });
    
    // Add buy routes
    listings.forEach((listing: any) => {
      if (listing.id && listing.propertyType && Array.isArray(listing.propertyType)) {
        listing.propertyType.forEach((type: string) => {
          const normalizedType = type.toLowerCase().replace(/\s+/g, '-');
          propertyRoutes.push({
            url: `${baseUrl}/buy/${normalizedType}/${listing.id}`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });
      }
    });
    
    // Fetch rental listings
    const rentalListings = await getListings({ 
      size: 1000,
      listingType: 'RENT'
    });
    
    // Add rent routes
    rentalListings.forEach((listing: any) => {
      if (listing.id && listing.propertyType && Array.isArray(listing.propertyType)) {
        listing.propertyType.forEach((type: string) => {
          const normalizedType = type.toLowerCase().replace(/\s+/g, '-');
          propertyRoutes.push({
            url: `${baseUrl}/rent/${normalizedType}/${listing.id}`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });
      }
    });
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error);
  }

  // Combine all routes
  return [...staticRoutes, ...blogRoutes, ...propertyRoutes];
}

