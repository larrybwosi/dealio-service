import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import localFont from 'next/font/local';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: "Cake Panier - Premium Bakery & Delivery Service",
    template: "%s | Cake Panier Bakery",
  },
  description:
    "Premium bakery offering fresh cakes, pastries, beverages & snacks with delivery service. Specializing in event cakes, beef pies, chicken pies, pizza, and artisanal baked goods.",
  keywords: [
    // Core bakery terms
    "bakery",
    "cake panier",
    "fresh baked goods",
    "artisanal bakery",
    "premium bakery",

    // Cakes
    "event cakes",
    "custom cakes",
    "vanilla cake",
    "marble cake",
    "fruit cake",
    "carrot cake",
    "lemon cake",
    "black forest cake",
    "red velvet cake",
    "white forest cake",
    "chocolate fudge cake",
    "chocolate cake",
    "birthday cakes",
    "wedding cakes",

    // Pastries & Baked Items
    "beef pie",
    "chicken pie",
    "sausage roll",
    "madeleine",
    "pistachio cake",
    "purple velvet",
    "cookies",
    "tea scones",
    "chocolate chip cookies",
    "fresh pastries",

    // Breads
    "white bread",
    "brown bread",
    "sweet bread",
    "grain bread",
    "artisan bread",
    "fresh bread",

    // Snacks & Food
    "pizza",
    "beef pizza",
    "chicken pizza",
    "chips",
    "spicy chips",
    "cheesy chips",
    "masala chips",
    "kebab",
    "samosas",
    "burgers",
    "small burgers",
    "large burgers",

    // Beverages
    "sugarcane juice",
    "fresh juice",
    "sodas",
    "cardamom tea",
    "white coffee",
    "black coffee",
    "milkshakes",
    "energy drinks",
    "fresh beverages",

    // Services
    "bakery delivery",
    "cake delivery",
    "food delivery",
    "online bakery",
    "takeaway",
    "catering service",
  ],
  authors: [{ name: "Cake Panier Bakery" }],
  creator: "Cake Panier",
  publisher: "Cake Panier Bakery",

  openGraph: {
    title: "Cake Panier - Premium Bakery & Delivery Service",
    description:
      "Fresh cakes, pastries, beverages & snacks delivered to your door. Specializing in event cakes, savory pies, and artisanal baked goods.",
    images: [
      {
        url: "https://cdn.sanity.io/images/7rkl59hi/production/a5c0fa6115fafb5d79fb5f1b1bbe623d57d33d05-1905x991.png?auto=format&fmt=webp", // Update with your actual bakery image
        width: 1200,
        height: 630,
        alt: "Cake Panier Bakery - Fresh Cakes and Pastries",
      },
      {
        url: "https://cdn.sanity.io/images/7rkl59hi/production/4c3e8f308baec02e30cab2a5a2ffd98235db4129-3024x4032.jpg?auto=format&fmt=webp", // Additional product showcase image
        width: 1200,
        height: 630,
        alt: "Premium Cakes, Pastries and Baked Goods",
      },
    ],
    url: "https://cakepanier.vercel.app", // Update with your actual domain
    type: "website",
    locale: "en_US",
    siteName: "Cake Panier Bakery",
  },

  twitter: {
    card: "summary_large_image",
    title: "Cake Panier - Premium Bakery & Delivery",
    description:
      "Fresh cakes, pastries & snacks with delivery. Event cakes, beef pies, pizza & more!",
    images: [
      "https://cdn.sanity.io/images/7rkl59hi/production/a5c0fa6115fafb5d79fb5f1b1bbe623d57d33d05-1905x991.png?auto=format&fmt=webp",
    ], // Update with your actual image
    creator: "@cakepanier", // Update with your Twitter handle
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
    // bing: 'your-bing-verification-code',
  },

  alternates: {
    canonical: "https://cakepanier.vercel.app",
  },

  category: "food",

  other: {
    "business:contact_data:locality": "Kaimosi",
    "business:contact_data:region": "Cheptulu",
    "business:contact_data:country_name": "Kenya",
    "business:hours:day":
      "monday tuesday wednesday thursday friday saturday sunday",
    "business:hours:start": "08:00",
    "business:hours:end": "20:00",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId="G-L0MS04RB1W" />
      <body className={`antialiased font-sans bg-gray-50`}>
        <>{children}</>
        <Footer />
      </body>
    </html>
  );
}