import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { SearchProvider } from "@/contexts/SearchContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SearchModal } from "@/components/SearchModal";
import { ThemeScript } from "@/components/ThemeScript";
import { UmamiTracking } from "@/components/UmamiTracking";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const siteUrl = getSiteUrl();
const siteOrigin = siteUrl.replace(/\/$/, "");

const siteDescription =
  "Connecting digital tools with on-the-ground action—empowering communities to build more resilient local economies through local currencies, innovative funding models, and community-led governance.";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteOrigin}/#website`,
      url: siteUrl,
      name: "Ethereum Localism",
      description: siteDescription,
      publisher: { "@id": `${siteOrigin}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${siteOrigin}/#organization`,
      name: "Ethereum Localism",
      url: siteUrl,
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ethereum Localism",
    template: "%s | Ethereum Localism",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Ethereum Localism",
    title: "Ethereum Localism",
    description: siteDescription,
    images: [
      {
        url: "/hero-graphic.png",
        width: 1200,
        height: 630,
        alt: "Ethereum Localism",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethereum Localism",
    description: siteDescription,
    images: ["/hero-graphic.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: new URL("/favicon.ico", siteUrl).href, sizes: "any" },
      { url: new URL("/logo-mark-bw.png", siteUrl).href, sizes: "256x256", type: "image/png" },
    ],
    apple: { url: new URL("/logo-mark-bw.png", siteUrl).href, sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeScript />
        <ThemeProvider>
          <SearchProvider>
            {children}
            <SearchModal />
          </SearchProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              src="https://cloud.umami.is/script.js"
              data-website-id="960685a1-4ecc-4978-ba1f-1fdd975075ae"
              data-domains="ethereumlocalism.xyz,www.ethereumlocalism.xyz"
              strategy="afterInteractive"
            />
            <UmamiTracking />
          </>
        )}
      </body>
    </html>
  );
}
