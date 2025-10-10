"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { LogoText } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { ArrowRight, LogIn, Heart, Info } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/feed")
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <LogoText />
          <Link href="/auth">
            <Button variant="ghost" size="sm" className="gap-2">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center py-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-serif font-light text-balance leading-tight">
              Add taste to your life
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto text-pretty leading-relaxed">
              Where whispers meet sophistication. Like a perfectly crafted negroni, Whisperoni blends intimacy with
              elegance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href={isAuthenticated ? "/feed" : "/auth"}>
                <Button size="lg" className="gap-2 text-base px-8">
                  {isAuthenticated ? "Go to Feed" : "Get Started"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link href="/feed">
                  <Button size="lg" variant="outline" className="text-base px-8 bg-transparent">
                    Explore Feed
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-serif font-light">Love doesn't need noise</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                In a world of endless scrolling and public performances, we believe in something different.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 pt-8">
              <div className="space-y-3 text-center">
                <div className="text-4xl font-serif text-accent">No Comments</div>
                <p className="text-muted-foreground leading-relaxed">
                  Your thoughts deserve private conversations, not public debates
                </p>
              </div>

              <div className="space-y-3 text-center">
                <div className="text-4xl font-serif text-accent">No Likes</div>
                <p className="text-muted-foreground leading-relaxed">
                  Authentic connections aren't measured in hearts and thumbs
                </p>
              </div>

              <div className="space-y-3 text-center">
                <div className="text-4xl font-serif text-accent">Just Whispers</div>
                <p className="text-muted-foreground leading-relaxed">Private chats where real relationships begin</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif font-light">The art of the whisper</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Like swinging gently on a summer evening, Whisperoni creates a rhythm of connection. Share your story
              through posts, then whisper privately to those who resonate with you.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Named after the sophisticated negroni cocktail, we bring the same balance of complexity and smoothness to
              modern dating. It's not about the noise—it's about the taste.
            </p>
          </div>
        </section>

        <section className="py-20 border-t border-border bg-gradient-to-b from-pink-50/50 to-background dark:from-pink-950/10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full mb-4">
              <Heart className="h-8 w-8 text-white fill-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-light">Play Cupid for Your Friends</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Know two people who'd be perfect together? You don't need an account to suggest a match. Just provide their
              phone numbers and we'll send them both a special invitation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/suggest-match">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8">
                  <Heart className="h-4 w-4" />
                  Suggest a Match
                </Button>
              </Link>
              <Link href="/how-matchmaking-works">
                <Button size="lg" variant="ghost" className="gap-2 text-base px-8">
                  <Info className="h-4 w-4" />
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border">
          <div className="max-w-xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif font-light">Ready to whisper?</h2>
            <p className="text-lg text-muted-foreground">
              Join a community where connections are crafted, not collected.
            </p>
            <Link href={isAuthenticated ? "/feed" : "/auth"}>
              <Button size="lg" className="gap-2 text-base px-8">
                {isAuthenticated ? "Go to Feed" : "Start Your Journey"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Whisperoni · Where love doesn't need noise</p>
        </div>
      </footer>
    </div>
  )
}
