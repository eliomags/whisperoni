import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { PostsProvider } from "@/lib/posts-context"
import { ChatProvider } from "@/lib/chat-context"
import { ModerationProvider } from "@/lib/moderation-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "whisperoni - Singles Club",
  description: "Connect with singles through meaningful posts",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <PostsProvider>
            <ChatProvider>
              <ModerationProvider>
                {children}
                <Toaster />
              </ModerationProvider>
            </ChatProvider>
          </PostsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
