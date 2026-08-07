import type { Metadata } from 'next';
import { DM_Sans, Outfit } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'SKINAA Link — One smart link to all app stores',
  description: 'Smart link router with OS detection, click analytics, and a blog CMS.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${outfit.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
