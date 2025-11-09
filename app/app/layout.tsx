import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import { WalletProvider } from '@/providers/WalletProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { ThemedToaster } from '@/components/ThemedToaster'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'X402 Referral Engine',
  description: 'Open-source referral platform powered by x402 protocol and Solana blockchain',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'system';
                if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <WalletProvider>
            {children}
            <ThemedToaster />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
