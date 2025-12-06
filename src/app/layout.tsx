import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DinnerSwipe - Perfecte Menu Keuze',
  description: 'Ontdek je perfecte diner door te swipen door heerlijke gerechten',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}
