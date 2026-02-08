import { TamboConfig } from "@/providers/TamboConfig";
import { ReactNode } from "react";
import "./globals.css";
import { Metadata, Viewport } from "next";

// SEO & GEO Optimized Metadata
export const metadata: Metadata = {
    // Basic SEO
    title: {
        default: "Tambo Pulse | Clinical Command Center - AI-Powered Healthcare Analytics",
        template: "%s | Tambo Pulse"
    },
    description: "Next-generation clinical operations dashboard with real-time patient monitoring, predictive risk analysis, and resource optimization powered by Generative UI and HealthData.gov APIs.",
    keywords: [
        "clinical command center",
        "healthcare analytics",
        "patient monitoring",
        "AI healthcare",
        "medical dashboard",
        "risk analysis",
        "hospital management",
        "real-time vitals",
        "generative UI",
        "HealthData.gov",
        "clinical operations",
        "health data",
        "predictive analytics",
        "medical AI"
    ],
    authors: [{ name: "Tambo Medical Systems" }],
    creator: "Tambo Medical Systems",
    publisher: "Tambo Medical Systems",
    
    // Robots
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
    
    // Canonical URL
    alternates: {
        canonical: "https://tambopulse.com",
    },
    
    // Open Graph (Social Media)
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://tambopulse.com",
        siteName: "Tambo Pulse",
        title: "Tambo Pulse | Clinical Command Center",
        description: "Next-generation clinical operations dashboard with real-time patient monitoring and AI-powered analytics.",
        images: [
            {
                url: "https://tambopulse.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Tambo Pulse Clinical Command Center Dashboard"
            }
        ],
    },
    
    // Twitter Card
    twitter: {
        card: "summary_large_image",
        title: "Tambo Pulse | Clinical Command Center",
        description: "Next-generation clinical operations dashboard with real-time patient monitoring and AI-powered analytics.",
        images: ["https://tambopulse.com/twitter-image.jpg"],
        creator: "@tambopulse",
    },
    
    // Icons
    icons: {
        icon: [
            { url: "/favicon.svg", type: "image/svg+xml" },
            { url: "/favicon.ico", sizes: "any" }
        ],
        shortcut: "/favicon.svg",
        apple: "/apple-touch-icon.png",
        other: [
            {
                rel: "mask-icon",
                url: "/safari-pinned-tab.svg",
                color: "#dc2626"
            }
        ]
    },
    
    // Manifest
    manifest: "/site.webmanifest",
    
    // Verification (Add your actual verification codes)
    verification: {
        google: "your-google-verification-code",
        yandex: "your-yandex-verification-code",
        other: {
            me: ["contact@tambopulse.com"]
        }
    },
    
    // Category
    category: "Healthcare Technology",
    
    // Classification
    classification: "Medical Software, Healthcare Analytics, Clinical Operations",
};

// Viewport configuration
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: "(prefers-color-scheme: dark)", color: "#020617" },
        { media: "(prefers-color-scheme: light)", color: "#ffffff" }
    ],
    colorScheme: "dark"
};

// Structured Data (Schema.org)
const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": "https://tambopulse.com/#website",
            "url": "https://tambopulse.com",
            "name": "Tambo Pulse",
            "description": "Clinical Command Center with AI-powered healthcare analytics",
            "publisher": {
                "@id": "https://tambopulse.com/#organization"
            },
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://tambopulse.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
            }
        },
        {
            "@type": "Organization",
            "@id": "https://tambopulse.com/#organization",
            "name": "Tambo Medical Systems",
            "url": "https://tambopulse.com",
            "logo": {
                "@type": "ImageObject",
                "url": "https://tambopulse.com/logo.svg",
                "width": 512,
                "height": 512
            },
            "sameAs": [
                "https://twitter.com/tambopulse",
                "https://linkedin.com/company/tambo-medical",
                "https://github.com/tambopulse"
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-800-TAMBO-PULSE",
                "contactType": "technical support",
                "availableLanguage": ["English"]
            }
        },
        {
            "@type": "WebApplication",
            "@id": "https://tambopulse.com/#webapp",
            "name": "Tambo Pulse Clinical Command Center",
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Any",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            },
            "featureList": [
                "Real-time patient monitoring",
                "Predictive risk analysis",
                "Resource optimization",
                "Generative UI",
                "HealthData.gov integration"
            ],
            "softwareVersion": "4.0.2",
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "127"
            }
        },
        {
            "@type": "MedicalWebPage",
            "@id": "https://tambopulse.com/#medicalpage",
            "about": {
                "@type": "MedicalEntity",
                "name": "Clinical Decision Support System"
            },
            "audience": {
                "@type": "MedicalAudience",
                "audienceType": "Healthcare Professional"
            }
        }
    ]
};

// GEO Meta Tags Component
function GeoMetaTags() {
    return (
        <>
            {/* Geographic Location */}
            <meta name="geo.region" content="US-CA" />
            <meta name="geo.placename" content="San Francisco" />
            <meta name="geo.position" content="37.7749;-122.4194" />
            <meta name="ICBM" content="37.7749, -122.4194" />
            
            {/* Dublin Core */}
            <meta name="DC.title" content="Tambo Pulse Clinical Command Center" />
            <meta name="DC.creator" content="Tambo Medical Systems" />
            <meta name="DC.subject" content="Healthcare Analytics, Clinical Operations, Medical AI" />
            <meta name="DC.description" content="AI-powered clinical command center for real-time patient monitoring" />
            <meta name="DC.publisher" content="Tambo Medical Systems" />
            <meta name="DC.date" content="2026-02-08" />
            <meta name="DC.type" content="InteractiveResource" />
            <meta name="DC.format" content="text/html" />
            <meta name="DC.language" content="en-US" />
            <meta name="DC.coverage" content="Worldwide" />
            <meta name="DC.rights" content="© 2026 Tambo Medical Systems" />
            
            {/* Mobile & App */}
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content="Tambo Pulse" />
            <meta name="application-name" content="Tambo Pulse" />
            <meta name="msapplication-TileColor" content="#dc2626" />
            <meta name="msapplication-config" content="/browserconfig.xml" />
            <meta name="format-detection" content="telephone=no" />
            
            {/* SEO Enhancements */}
            <meta name="rating" content="General" />
            <meta name="referrer" content="origin-when-cross-origin" />
            <meta name="theme-color" content="#020617" />
            
            {/* PWA */}
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/site.webmanifest" />
            
            {/* Preconnect for Performance */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://healthdata.gov" />
            <link rel="dns-prefetch" href="https://api.tambopulse.com" />
        </>
    );
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" dir="ltr">
            <head>
                <GeoMetaTags />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            </head>
            <body className="antialiased bg-slate-950 text-slate-100" suppressHydrationWarning>
                <TamboConfig>{children}</TamboConfig>
            </body>
        </html>
    );
}
