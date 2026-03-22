import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { metadata as siteMetadata, styles } from '@/lib/content'

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.author }],
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.url,
    siteName: 'blankxiro Studio',
    images: [
      {
        url: siteMetadata.ogImage,
        width: 1200,
        height: 630,
        alt: 'blankxiro Studio - Premium Print-on-Demand',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [siteMetadata.ogImage],
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
  alternates: {
    canonical: siteMetadata.url,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "blankxiro Studio",
    "url": siteMetadata.url,
    "logo": siteMetadata.ogImage,
    "description": siteMetadata.description,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-94144-58878",
      "contactType": "customer service",
      "email": "Khushankagrawal1209@gmail.com"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <style>{`
          :root {
            --primary: ${styles.colors.primary};
            --secondary: ${styles.colors.secondary};
            --accent: ${styles.colors.accent};
            --text: ${styles.colors.text};
            --background: ${styles.colors.background};
            --muted: ${styles.colors.muted};
            --radius: ${styles.borderRadius};
            --grid-opacity: ${styles.gridOpacity};
          }
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
          body {
            color: var(--text);
            background: var(--background);
          }
          .bg-grid-subtle {
            opacity: var(--grid-opacity) !important;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
