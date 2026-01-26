import type { Metadata } from 'next';
import './globals.css';
import '@phosphor-icons/web/regular';
import '@phosphor-icons/web/bold';
import '@phosphor-icons/web/fill';
import Script from 'next/script';
import Layout from './components/Layout';
import StoreProvider from './StoreProvider';

export const metadata: Metadata = {
  title: 'Premium Dubai Properties | Astra Terra Real Estate',
  description: 'Luxury properties in Dubai for sale & rent. Villas, apartments & investment opportunities in Palm Jumeirah, Downtown & Marina. Expert real estate agency.',
  keywords: 'properties in Dubai, invest in Dubai property, premium properties Dubai, Dubai luxury properties, real estate Dubai, top real estate agency Dubai, Palm Jumeirah villas, Downtown Dubai apartments',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: 'https://www.astraterra.ae/',
  },
  verification: {
    google: 'K7vDqtfWxQ7LzO54E2y4k7f9VPGhytqDJDrotZ1a-Vs',
  },
  other: {
    'geo.region': 'AE-DU',
    'geo.placename': 'Dubai',
    'language': 'English',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AE">
      <head>
        <link rel="icon" type="image/x-icon" href="/img/fav.webp" />
        <meta httpEquiv="content-language" content="en-AE" />
      </head>
      <body>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PVSJGCSS');`,
          }}
        />
        <Script
          id="tidio-chat"
          src="//code.tidio.co/n1y5czjcktskr6kxkexm7siub2mvpjqg.js"
          strategy="lazyOnload"
        />
        <StoreProvider>
          <Layout>{children}</Layout>
        </StoreProvider>
      </body>
    </html>
  );
}
