import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navigation } from '../components/Navigation';

export const metadata: Metadata = {
  title: {
    default: 'CircleCare - Care-Centered Expense Sharing',
    template: '%s | CircleCare'
  },
  description: 'Transform expense sharing from tracking debts into flowing care. Built on Stacks with Clarity 4 for secure, transparent community financial collaboration.',
  keywords: [
    'expense sharing',
    'CircleCare', 
    'Stacks blockchain',
    'Clarity 4',
    'community finance',
    'STX payments',
    'care circles',
    'Web3 finance'
  ],
  authors: [{ name: 'CircleCare Team' }],
  creator: 'CircleCare',
  publisher: 'CircleCare',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://circlecare.xyz'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://circlecare.xyz',
    siteName: 'CircleCare',
    title: 'CircleCare - Care-Centered Expense Sharing',
    description: 'Transform expense sharing from tracking debts into flowing care. Built on Stacks with Clarity 4.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CircleCare - Care-Centered Expense Sharing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CircleCare - Care-Centered Expense Sharing',
    description: 'Transform expense sharing from tracking debts into flowing care. Built on Stacks with Clarity 4.',
    images: ['/og-image.png'],
    creator: '@CircleCare_xyz',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="antialiased">
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}