import type { Metadata, Viewport } from 'next';
import { Amiri, Cormorant_Garamond, Manrope } from 'next/font/google';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SearchPanel } from '@/components/layout/SearchPanel';
import { EasterEggs } from '@/components/layout/EasterEggs';
import { AppProviders } from '@/lib/providers';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-manrope',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'The Ottoman Empire · 1299 — 1922 · Six Centuries That Changed the World',
    template: '%s · The Ottoman Empire',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ['Ottoman Empire', 'Ottoman history', 'Sultans', 'Constantinople 1453', 'Süleyman the Magnificent', 'Mimar Sinan', 'Tanzimat', 'Istanbul', 'interactive history'],
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: 'The Ottoman Empire · 1299 — 1922',
    description: 'Six centuries that changed the world — an immersive, historically responsible interactive journey.',
    url: SITE_URL,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'The Ottoman Empire, 1299–1922 — a stylized Constantinople skyline at dusk' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Ottoman Empire · 1299 — 1922',
    description: 'Six centuries that changed the world.',
    images: ['/og.png'],
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.webmanifest',
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#0a0908',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} ${amiri.variable}`} suppressHydrationWarning>
      <body className="grain min-h-screen antialiased">
        <AppProviders>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
          <SearchPanel />
          <EasterEggs />
        </AppProviders>
      </body>
    </html>
  );
}
