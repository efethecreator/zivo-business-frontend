import type React from "react"
import localFont from "next/font/local"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/QueryProvider"

// Load custom Outfit font with all weights
const outfitFont = localFont({
  src: [
    {
      path: "../public/fonts/Outfit-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/Outfit-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Outfit-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Outfit-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-outfit",
})

export const metadata = {
  title: "ZIVO - Professional Appointment Platform",
  description: "Professional appointment management system for your business",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={outfitFont.variable}>
      <body className={`font-outfit`}>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
