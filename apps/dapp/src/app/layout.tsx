import type { Metadata, Viewport } from 'next';
import type { PropsWithChildren } from 'react';

import { Providers } from '@/app/providers';
import { CoreLayout } from '@/components/CoreLayout';
import { Toaster } from '@/components/ui/sonner';
import { inter } from '@/fonts';
import { cn } from '@/functions/cn';

import '@/styles/main.css';

export const viewport: Viewport = {
  themeColor: 'black',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Replicant Network | Custom AI Models. At Your Fingertips.',
    template: 'Replicant Network | %s',
  },
  description:
    'Replicant Network is an upcoming platform democratizing AI model development through decentralized collaboration.',
  authors: {
    name: 'Lutra Labs',
    url: 'https://lutralabs.io/',
  },
  keywords: [
    'ai',
    'agents',
    'ethereum',
    'decentralized',
    'machine learning',
    'artificial intelligence',
  ],
  openGraph: {
    images: [
      {
        url: 'https://rplcnt.io/api/og',
        width: 1200,
        height: 630,
        alt: 'Replicant Network Page Image',
      },
    ],
    title: 'Replicant Network',
    description:
      'Replicant Network is an upcoming platform democratizing AI model development through decentralized collaboration.',
    type: 'website',
    locale: 'en_US',
    url: process.env.APP_URL ?? 'http://localhost:3000',
    siteName: 'Replicant Network',
    emails: ['info@lutralabs.io'],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://rplcnt.io/api/og',
        width: 1200,
        height: 630,
        alt: 'Replicant Network Page Image',
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
    'max-image-preview': 'standard',
  },
};

const GlobalLayout = ({ children }: PropsWithChildren) => {
  return (
    <html suppressHydrationWarning className={cn(inter.variable)} lang="en">
      <meta content="app" name="apple-mobile-web-app-title" />
      <body>
        <Providers
          disableTransitionOnChange
          enableSystem
          attribute="class"
          defaultTheme="system"
        >
          <CoreLayout>{children}</CoreLayout>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
};

export default GlobalLayout;
