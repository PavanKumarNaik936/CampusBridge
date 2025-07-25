'use client';

import { Toaster } from 'sonner';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/landing/Navbar';
import FeedbackFab from '@/components/FeedbackFab'; // 👈 Import it

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          {children}

          <FeedbackFab /> {/* 👈 Floating Feedback Button */}

          <Toaster position="top-center" richColors />
        </SessionProvider>
      </body>
    </html>
  );
}
