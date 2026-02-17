import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { SearchProvider } from "@/contexts/SearchContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SearchModal } from "@/components/SearchModal";
import { ThemeScript } from "@/components/ThemeScript";
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

const siteUrl = process.env.SITE_URL ?? "https://www.ethereumlocalism.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ethereum Localism",
    template: "%s | Ethereum Localism",
  },
  description:
    "Connecting digital tools with on-the-ground action—empowering communities to build more resilient local economies through local currencies, innovative funding models, and community-led governance.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Ethereum Localism",
    title: "Ethereum Localism",
    description:
      "Connecting digital tools with on-the-ground action—empowering communities to build more resilient local economies through local currencies, innovative funding models, and community-led governance.",
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
    description:
      "Connecting digital tools with on-the-ground action—empowering communities to build more resilient local economies.",
    images: ["/hero-graphic.png"],
  },
  robots: {
    index: true,
    follow: true,
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
        <ThemeScript />
        <ThemeProvider>
          <SearchProvider>
            {children}
            <SearchModal />
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
