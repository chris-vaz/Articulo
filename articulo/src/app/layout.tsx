import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from '@/components/ui/sonner'
import { appUrl } from '@/lib/env'

const font = DM_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-sans' })

export const metadata: Metadata = {
  metadataBase: new URL(appUrl()),
  title: {
    default: 'Articulo · Automate your work',
    template: '%s · Articulo',
  },
  description:
    'Connect Google Drive, Slack, Notion and Discord with visual, no-code workflows.',
  openGraph: {
    title: 'Articulo · Automate your work',
    description:
      'Connect Google Drive, Slack, Notion and Discord with visual, no-code workflows.',
    images: ['/screenshots/editor.webp'],
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        // Follows the app's light/dark theme through the CSS variables in globals.css.
        variables: {
          colorPrimary: 'hsl(var(--primary))',
          colorPrimaryForeground: 'hsl(var(--primary-foreground))',
          colorBackground: 'hsl(var(--card))',
          colorForeground: 'hsl(var(--foreground))',
          colorMutedForeground: 'hsl(var(--muted-foreground))',
          colorMuted: 'hsl(var(--muted))',
          colorInput: 'hsl(var(--background))',
          colorInputForeground: 'hsl(var(--foreground))',
          colorBorder: 'hsl(var(--border))',
          colorNeutral: 'hsl(var(--foreground))',
          borderRadius: '0.625rem',
        },
        elements: {
          socialButtonsBlockButton: 'border border-border',
          formFieldInput: 'border border-input',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning className={font.variable}>
        <body className="font-sans">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors closeButton position="bottom-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
