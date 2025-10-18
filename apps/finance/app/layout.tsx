import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: 'Dealio - Smart Expense Management & Budget Tracking App',
    template: '%s | Dealio',
  },
  description:
    'Transform your financial management with Dealio - the comprehensive expense tracking, budget planning, and financial analytics platform. Track spending, manage budgets, and gain insights into your finances with powerful reporting tools.',
  keywords: [
    'expense management',
    'budget tracking',
    'financial planning',
    'expense tracker',
    'budget app',
    'financial management software',
    'spending tracker',
    'personal finance',
    'expense reporting',
    'budget planner',
    'financial analytics',
    'money management',
    'expense control',
    'financial dashboard',
  ],
  authors: [{ name: 'Dealio Team' }],
  creator: 'Dealio',
  publisher: 'Dealio',
  category: 'Finance',
  classification: 'Business & Finance Software',
  applicationName: 'Dealio',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
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
  openGraph: {
    type: 'website',
    siteName: 'Dealio',
    title: 'Dealio - Smart Expense Management & Budget Tracking',
    description:
      "Take control of your finances with Dealio's powerful expense tracking and budget management tools. Get real-time insights, detailed reports, and smart financial planning features.",
    url: 'https://dealio.app',
    // images: [
    //   {
    //     url: "/og-image.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "Dealio - Expense Management Dashboard",
    //     type: "image/png",
    //   },
    //   {
    //     url: "/og-image-square.png",
    //     width: 1200,
    //     height: 1200,
    //     alt: "Dealio App Logo",
    //     type: "image/png",
    //   },
    // ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@DealioApp',
    creator: '@DealioApp',
    title: 'Dealio - Smart Expense Management & Budget Tracking',
    description:
      'Transform your financial management with powerful expense tracking, budget planning, and financial analytics. Start managing your money smarter today.',
  },
  alternates: {
    canonical: 'https://dealio-finance.vercel.app',
    languages: {
      'en-US': 'https://dealio-finance.vercel.app',
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dealio',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
