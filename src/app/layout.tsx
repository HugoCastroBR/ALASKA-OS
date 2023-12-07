import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import Providers from './providers';
import Script from 'next/script';

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
      <head>
        <Script src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"></Script>
      </head>
      <body className={`${inter.className} !overflow-clip`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
