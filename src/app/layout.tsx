import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FF9A9E',
}

export const metadata: Metadata = {
  title: 'DinnerSwipe',
  description: 'Vind je perfecte match',
  applicationName: 'DinnerSwipe',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DinnerSwipe',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className={`${inter.variable}`}>
      <body className="antialiased min-h-screen overscroll-none touch-pan-y selection:bg-pink-200">
        {children}
      </body>
    </html>
  )
}
