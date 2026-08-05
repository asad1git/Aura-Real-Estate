import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { CustomCursor } from "@/components/layout/CustomCursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Aura Real Estate",
    default: "Aura Real Estate | Curated Luxury Properties",
  },
  description: "Aura Real Estate represents the world's most extraordinary homes, defined by exceptional architecture and uncompromising quality.",
  keywords: ["Luxury Real Estate", "Beverly Hills Homes", "Architectural Properties", "High-End Estates", "Aura Real Estate"],
  authors: [{ name: "Aura Private Client Group" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aurarealestate.com",
    title: "Aura Real Estate | Exclusive Global Portfolio",
    description: "Discover curated architectural masterpieces and luxury estates around the world.",
    siteName: "Aura Real Estate",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Aura Real Estate - The Glass Pavilion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura Real Estate",
    description: "Discover curated architectural masterpieces.",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop"],
    creator: "@aurarealestate",
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
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Aura Real Estate",
  image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop",
  "@id": "https://aurarealestate.com",
  url: "https://aurarealestate.com",
  telephone: "+13105550199",
  address: {
    "@type": "PostalAddress",
    streetAddress: "420 Luxury Lane, Suite 100",
    addressLocality: "Beverly Hills",
    addressRegion: "CA",
    postalCode: "90210",
    addressCountry: "US"
  },
  priceRange: "$$$$",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00"
  },
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Preloader />
        <CustomCursor />
        <SmoothScrollProvider>
          {children}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
