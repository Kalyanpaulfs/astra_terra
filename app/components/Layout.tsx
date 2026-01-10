'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Navbar from './Navbar';
import Footer from './Footer';

import ChatWidget from './ChatWidget';

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
