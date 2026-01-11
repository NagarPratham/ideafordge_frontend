import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

// Using CSS imports instead of next/font/google to avoid Turbopack font resolution issues

export const metadata: Metadata = {
  title: "IdeaForge AI - Transform Ideas Into Validated Ventures",
  description:
    "AI-powered startup idea validation platform. Get market analysis, risk assessment, and actionable insights in minutes.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">{children}</body>
    </html>
  )
}
