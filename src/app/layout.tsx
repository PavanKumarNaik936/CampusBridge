'use client';

import {Toaster} from 'sonner'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react';
const inter = Inter({ subsets: ['latin'] })
import Navbar from '@/components/landing/Navbar';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
            
        <SessionProvider>
          <Navbar/>
            {children}
            <Toaster position="top-center" richColors />
        </SessionProvider>
        
        </body>
    </html>
  )
}
