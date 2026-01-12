import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { ModeToggle } from "@/components/mode-toggle"

export const metadata: Metadata = {
  title: "Articulo",
  description: "High-Performance SaaS Automation Builder",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Navbar */}
          <header className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h1 className="text-xl font-bold">Articulo</h1>
            <ModeToggle />
          </header>

          {/* Main content */}
          <main className="p-6 min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
