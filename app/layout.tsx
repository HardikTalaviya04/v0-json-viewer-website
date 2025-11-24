import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "JSON Viewer & Formatter - Free Online JSON Editor | Cricket Asia Cup Data",
  description:
    "Professional online JSON viewer, editor, and formatter with syntax highlighting, tree view, diff comparison, and table export. Perfect for developers. Includes Cricket Asia Cup India vs Pakistan team data.",
  keywords:
    "JSON viewer, JSON editor, JSON formatter, JSON validator, JSON diff, JSON to CSV, online JSON tool, json parser, json beautifier, format json, cricket asia cup, india pakistan cricket data",
  authors: [{ name: "Format JSON Data Team" }],
  creator: "Format JSON Data",
  publisher: "Format JSON Data",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://formatjsondata.vercel.app"),
  alternates: {
    canonical: "https://formatjsondata.vercel.app",
  },
  openGraph: {
    title: "JSON Viewer & Formatter - Free Professional Online Editor",
    description:
      "Format, validate, and analyze JSON data with advanced features like diff comparison, table view, and AI analysis. Handle large JSON files instantly.",
    url: "https://formatjsondata.vercel.app",
    siteName: "Format JSON Data",
    images: [
      {
        url: "https://formatjsondata.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Format JSON Data - Professional JSON Editor Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Viewer & Formatter - Free Professional Online Editor",
    description:
      "Format, validate, and analyze JSON data with advanced features including diff comparison and AI analysis.",
    images: ["https://formatjsondata.vercel.app/og-image.png"],
    creator: "@formatjsondata",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f172a" />
        <meta
          name="description"
          content="Professional online JSON formatter, validator and viewer with advanced features. Format JSON data, compare JSON files, and export to CSV/table format."
        />
        <meta
          name="keywords"
          content="json formatter, json validator, json viewer, json editor, json beautifier, json parser, cricket asia cup, india vs pakistan"
        />
        <meta name="author" content="Format JSON Data Team" />
        <meta name="copyright" content="Format JSON Data" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />

        <meta property="og:title" content="JSON Viewer & Formatter - Free Professional Online Editor" />
        <meta
          property="og:description"
          content="Format, validate, and analyze JSON data with advanced features like diff comparison and table view."
        />
        <meta property="og:url" content="https://formatjsondata.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://formatjsondata.vercel.app/og-image.png" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "JSON Viewer & Formatter",
              description:
                "Professional online JSON editor, formatter, and viewer with advanced features including syntax highlighting, diff comparison, table export, and AI analysis.",
              url: "https://formatjsondata.vercel.app",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web Browser",
              browserRequirements: "Requires JavaScript and modern browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "JSON Formatter",
                "JSON Viewer with Tree Navigation",
                "JSON Syntax Highlighting",
                "JSON Validation",
                "JSON Diff Comparison",
                "Table View and CSV Export",
                "Share Functionality",
                "AI-powered JSON Analysis",
                "Multiple Color Themes",
                "Support for Large JSON Files",
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "2500",
              },
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Format JSON Data",
              url: "https://formatjsondata.vercel.app",
              logo: "https://formatjsondata.vercel.app/logo.png",
              description: "Professional JSON formatter and editor",
              sameAs: ["https://twitter.com/formatjsondata", "https://github.com/formatjsondata"],
            }),
          }}
        />

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3534303211318862"
          crossOrigin="anonymous"
        ></script>
        {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}');
              `,
            }}
          />
        )}
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Suspense fallback={null}>{children}</Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
