import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, DM_Mono, Unbounded } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";
import FormModalProvider from "@/components/providers/FormModalProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageReveal from "@/components/ui/PageReveal";
import ScrollProgress from "@/components/ui/ScrollProgress";
import GrainOverlay from "@/components/ui/GrainOverlay";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
});

const unbounded = Unbounded({
  weight: ["900"],
  subsets: ["latin"],
  variable: "--font-unbounded",
});

const SITE_URL = "https://www.coda.studio";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "CODA — Digital Product Studio | Web, AI & Growth Systems",
    template: "%s | CODA Studio",
  },

  description:
    "CODA builds high-performance digital systems — web platforms, AI integrations, brand & design systems, and growth engineering. We engineer ecosystems that compound, not just websites.",

  keywords: [
    "web development agency",
    "digital product studio",
    "build a website",
    "web app development",
    "AI integration agency",
    "LLM integration",
    "full stack development",
    "Next.js agency",
    "React development agency",
    "design system agency",
    "brand identity studio",
    "SEO agency",
    "growth engineering",
    "conversion rate optimization",
    "digital transformation",
    "startup web development",
    "SaaS development agency",
    "build a web app",
    "hire web developers",
    "product design agency",
    "UI UX design agency",
    "marketing funnel agency",
    "digital marketing agency",
    "CODA studio",
    "CODA digital agency",
  ],

  authors: [{ name: "CODA Studio", url: SITE_URL }],
  creator: "CODA Studio",
  publisher: "CODA Studio",

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "CODA Studio",
    title: "CODA — Digital Product Studio | Web, AI & Growth Systems",
    description:
      "We build high-performance digital ecosystems — web platforms, AI products, design systems, and growth engines. System-first. Built to compound.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CODA Studio — Digital Product Studio",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "CODA — Digital Product Studio | Web, AI & Growth Systems",
    description:
      "We build high-performance digital ecosystems — web platforms, AI products, design systems, and growth engines.",
    images: ["/og-image.png"],
    creator: "@codastudio",
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

  alternates: {
    canonical: SITE_URL,
  },

  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "CODA Studio",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "CODA builds high-performance digital systems — web platforms, AI integrations, brand & design systems, and growth engineering.",
  priceRange: "$$$",
  areaServed: "Worldwide",
  knowsAbout: [
    "Web Development",
    "AI Integration",
    "Full-Stack Engineering",
    "Brand Design",
    "Design Systems",
    "SEO",
    "Growth Engineering",
    "SaaS Development",
    "UI/UX Design",
  ],
  sameAs: [],
  serviceType: [
    "Web Platform Development",
    "AI & LLM Integration",
    "Design System Creation",
    "Brand Identity",
    "SEO & Growth Engineering",
    "Full-Stack Web Applications",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${dmSans.variable} ${dmMono.variable} ${unbounded.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen selection:bg-[#FF5C00] selection:text-white">
        {/* Skip to main — keyboard accessibility */}
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <LenisProvider>
          <FormModalProvider>
            <PageReveal />
            <ScrollProgress />
            <GrainOverlay />
            <Navbar />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
          </FormModalProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
