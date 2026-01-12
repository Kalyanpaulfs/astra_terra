import Link from 'next/link';
import { getSitemapData } from '../lib/sitemap-data';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './sitemap.module.css';

export const revalidate = 3600; // Revalidate every hour

export default async function SitemapHTMLPage() {
  const entries = await getSitemapData();
  
  // Group entries by category
  const groupedEntries = entries.reduce((acc, entry) => {
    const category = entry.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>);

  const categories = Object.keys(groupedEntries).sort();

  return (
    <>
      <Navbar />
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0d1625 0%, #1a2332 100%)',
        paddingTop: '120px',
        paddingBottom: '60px'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Header */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '4rem',
            color: '#fff'
          }}>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Sitemap
            </h1>
            <div style={{ 
              width: '80px', 
              height: '4px', 
              background: 'var(--accent-gold, #d4af37)', 
              margin: '0 auto 20px' 
            }}></div>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#d1d5db',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Explore all pages and content on Astra Terra Properties
            </p>
            <div style={{ 
              marginTop: '2rem',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link 
                href="/sitemap.xml" 
                className={styles.sitemapLink}
              >
                View XML Sitemap
              </Link>
              <div style={{ 
                color: '#888',
                fontSize: '0.9rem',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center'
              }}>
                Total: {entries.length} URLs
              </div>
            </div>
          </div>

          {/* Sitemap Content */}
          <div style={{ 
            display: 'grid', 
            gap: '2rem' 
          }}>
            {categories.map((category) => (
              <div 
                key={category}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '2rem',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <h2 style={{ 
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: '#d4af37',
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '2px solid rgba(212, 175, 55, 0.3)'
                }}>
                  {category}
                  <span style={{ 
                    fontSize: '1rem',
                    fontWeight: 'normal',
                    color: '#888',
                    marginLeft: '1rem'
                  }}>
                    ({groupedEntries[category].length} {groupedEntries[category].length === 1 ? 'page' : 'pages'})
                  </span>
                </h2>
                
                <div style={{
                  display: 'grid',
                  gap: '0.75rem'
                }}>
                  {groupedEntries[category].map((entry, index) => (
                    <div
                      key={index}
                      className={styles.entryItem}
                    >
                      <Link
                        href={entry.url.replace(/^https?:\/\/[^/]+/, '')}
                        style={{
                          flex: 1,
                          color: '#fff',
                          textDecoration: 'none',
                          fontSize: '1rem',
                          fontWeight: '500',
                          wordBreak: 'break-word'
                        }}
                      >
                        {entry.url.replace(/^https?:\/\/[^/]+/, '') || '/'}
                      </Link>
                      <div style={{
                        display: 'flex',
                        gap: '1rem',
                        fontSize: '0.85rem',
                        color: '#888',
                        flexWrap: 'wrap'
                      }}>
                        <span title={`Priority: ${entry.priority}`}>
                          Priority: {entry.priority}
                        </span>
                        <span title={`Change Frequency: ${entry.changeFrequency}`}>
                          Frequency: {entry.changeFrequency}
                        </span>
                        <span title={`Last Modified: ${entry.lastModified.toLocaleDateString()}`}>
                          Updated: {entry.lastModified.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div style={{
            marginTop: '4rem',
            padding: '2rem',
            textAlign: 'center',
            color: '#888',
            fontSize: '0.9rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p>
              This sitemap is automatically generated and updated every hour.
              <br />
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

