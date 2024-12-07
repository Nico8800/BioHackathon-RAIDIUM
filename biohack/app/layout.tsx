// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CustomCursor from '@/components/CustomCursor'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LumIA',
  description: 'Intelligence Artificielle pour Analyse Radiologique',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}