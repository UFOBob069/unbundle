import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Unbundle Finance — Deposit SPY or GOOGL, trade the pieces (backed & redeemable)',
  description: 'Mint component tokens from bundled assets. Arb-enforced parity, transparent mechanics, investor-grade UX.',
  keywords: 'ETF, stocks, trading, arbitrage, sum of parts, SPY, GOOGL, components, unbundle',
  authors: [{ name: 'Unbundle Finance' }],
  creator: 'Unbundle Finance',
  publisher: 'Unbundle Finance',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://unbundlefinance.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Unbundle Finance — Deposit SPY or GOOGL, trade the pieces (backed & redeemable)',
    description: 'Mint component tokens from bundled assets. Arb-enforced parity, transparent mechanics, investor-grade UX.',
    url: 'https://unbundlefinance.com',
    siteName: 'Unbundle Finance',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Unbundle Finance — Deposit SPY or GOOGL, trade the pieces (backed & redeemable)',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unbundle Finance — Deposit SPY or GOOGL, trade the pieces (backed & redeemable)',
    description: 'Mint component tokens from bundled assets. Arb-enforced parity, transparent mechanics, investor-grade UX.',
    images: ['/og.png'],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
