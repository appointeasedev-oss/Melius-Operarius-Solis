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
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
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
