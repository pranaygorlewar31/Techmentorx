import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Social Mentor - Making a Difference Together",
  description:
    "Connect donors with volunteers to deliver donations to those in need. Track your impact, earn points, and climb the leaderboard.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t bg-card py-6 text-center text-sm text-muted-foreground">
              <p>Social Mentor. Making a difference together.</p>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
