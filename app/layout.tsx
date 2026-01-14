import type { Metadata } from 'next';
import './globals.css';
import '@phosphor-icons/web/regular';
import '@phosphor-icons/web/bold';
import '@phosphor-icons/web/fill';
import Script from 'next/script';
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
        <Script
          id="tidio-chat"
          src="//code.tidio.co/n1y5czjcktskr6kxkexm7siub2mvpjqg.js"
          strategy="lazyOnload"
        />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
