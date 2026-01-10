'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Navbar from './Navbar';
import Footer from './Footer';

// Lazy load ChatWidget - not critical for initial render
const ChatWidget = dynamic(() => import('./ChatWidget'), {
  ssr: false,
  loading: () => null
});

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <ChatWidget />
    </>
  );
}
