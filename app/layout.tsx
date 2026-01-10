import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Layout from './components/Layout';

export const metadata: Metadata = {
  title: 'Astra Terra Properties - Premier Property Listing in Dubai UAE',
  description: 'Discover extraordinary properties in Dubai. From iconic towers to waterfront palaces.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/img/fav.png" />
      </head>
      <body>
        <Layout>{children}</Layout>
        {/* Load Phosphor Icons asynchronously - non-blocking */}
        <Script 
          src="https://unpkg.com/phosphor-icons" 
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
