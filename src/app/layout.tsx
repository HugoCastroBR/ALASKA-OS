import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@mantine/core/styles.css';
import Providers from './providers';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ALASKA-OS',
  description: 'An operating system for the web.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} !overflow-clip`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
