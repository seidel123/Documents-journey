import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Docs Clone',
  description: 'A simple document editing application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50/50 min-h-screen text-gray-900 selection:bg-blue-100 selection:text-blue-900`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
