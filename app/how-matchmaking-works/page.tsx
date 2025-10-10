"use client"

import Link from "next/link"
import { LogoText } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Link2, Bell, MessageCircle, Sparkles, ArrowRight, Share2 } from "lucide-react"

export default function HowMatchmakingWorks() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <LogoText />
          <Link href="/">
            <Button variant="ghost" size="sm">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center justify-center h-20 w-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-full mb-6">
            <Heart className="h-10 w-10 text-white fill-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-light mb-6 leading-tight">
            How Friend-Suggested Matches Work
          </h1>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">
            The art of matchmaking, reimagined for the digital age. Help your friends find connection through the power of personal introduction.
          </p>
        </section>

        {/* The Philosophy */}
        <section className="max-w-4xl mx-auto mb-20">
          <Card className="border-0 bg-gradient-to-br from-pink-50/50 to-red-50/30 dark:from-pink-950/10 dark:to-red-950/10">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start gap-4 mb-4">
                <Sparkles className="h-6 w-6 text-pink-500 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif font-light mb-4">
                    The Lost Art of Introduction
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    Before algorithms and endless swiping, matchmaking was personal. A friend who knew two people—their quirks, their dreams, their sense of humor—would bring them together with a simple introduction.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We believe that human intuition, that spark of recognition when you think "they'd be perfect together," is more powerful than any algorithm. So we've made it effortless to play cupid for your friends.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How It Works - Step by Step */}
        <section className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-center mb-12">
            The Journey
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Step 1 */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-red-500"></div>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-950/50">
                    <Users className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Step 1</div>
                    <h3 className="text-xl font-semibold">You See the Connection</h3>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  You know two singles who you think would click. Maybe they share a passion, a sense of humor, or that indefinable chemistry. Trust your instinct.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-red-500"></div>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-950/50">
                    <Link2 className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Step 2</div>
                    <h3 className="text-xl font-semibold">Create the Match</h3>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Visit our matchmaking page and enter their phone numbers. Add a personal note about why you think they'd be great together. No account needed.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-red-500"></div>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-950/50">
                    <Share2 className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Step 3</div>
                    <h3 className="text-xl font-semibold">Share the Invitations</h3>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We generate two unique invitation links—one for each person. Share them via text, WhatsApp, or any way you prefer. Each link is personal to them.
                </p>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-red-500"></div>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-950/50">
                    <Bell className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Step 4</div>
                    <h3 className="text-xl font-semibold">They Join Whisperoni</h3>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  When they click their link, they see a beautiful landing page explaining the match. If they're intrigued, they join Whisperoni with their phone number.
                </p>
              </CardContent>
            </Card>

            {/* Step 5 */}
            <Card className="relative overflow-hidden md:col-span-2">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-red-500"></div>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-950/50">
                    <MessageCircle className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Step 5</div>
                    <h3 className="text-xl font-semibold">The Connection Begins</h3>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Once both people join, they're notified that their match has arrived. They can view each other's profiles, browse posts, and start a private conversation. The rest is up to them—and to chemistry.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Note: If only one person joins initially, they'll see a "pending" status. We'll let them know when their match joins Whisperoni.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Why This Works */}
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-center mb-12">
            Why Friend Introductions Work
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <div className="text-4xl font-serif text-accent mb-3">Trust</div>
              <p className="text-muted-foreground leading-relaxed">
                A recommendation from a friend carries weight. It's pre-vetted by someone who knows both people.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="text-4xl font-serif text-accent mb-3">Context</div>
              <p className="text-muted-foreground leading-relaxed">
                Your friend can explain why you two would click—something an algorithm can't capture.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="text-4xl font-serif text-accent mb-3">Quality</div>
              <p className="text-muted-foreground leading-relaxed">
                One thoughtful introduction beats a hundred random swipes. Quality over quantity, always.
              </p>
            </Card>
          </div>
        </section>

        {/* Privacy & Design Principles */}
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-center mb-12">
            Our Principles
          </h2>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">🔒 Privacy First</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Phone numbers are only used for authentication and matching. We never sell or share your data. Both people must join Whisperoni before they can see each other's profiles.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">🎯 No Pressure</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Match suggestions are just that—suggestions. Both people can choose whether to join, view profiles, or start a conversation. There's no obligation, no awkwardness.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">♾️ No Expiration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Match invitation links never expire. People can join when they're ready. Love doesn't work on a timer.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">✨ Simple & Beautiful</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No complicated forms, no spam, no hidden fees. Just a simple, elegant way to introduce two people who might fall in love.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-center mb-12">
            Common Questions
          </h2>

          <div className="space-y-6">
            <div className="pb-6 border-b border-border">
              <h3 className="text-lg font-semibold mb-2">Do I need an account to suggest a match?</h3>
              <p className="text-muted-foreground leading-relaxed">
                No! Anyone can suggest a match. You don't need to be a Whisperoni user. Just visit the matchmaking page, fill in the details, and share the links.
              </p>
            </div>

            <div className="pb-6 border-b border-border">
              <h3 className="text-lg font-semibold mb-2">What if only one person joins?</h3>
              <p className="text-muted-foreground leading-relaxed">
                The first person to join will see a "pending" status in their matches. They'll be notified when the other person joins. The match becomes active when both people are on Whisperoni.
              </p>
            </div>

            <div className="pb-6 border-b border-border">
              <h3 className="text-lg font-semibold mb-2">Can the same two people be suggested multiple times?</h3>
              <p className="text-muted-foreground leading-relaxed">
                No. We prevent duplicate suggestions for the same pair of people. If they've already been suggested, you'll see an error message.
              </p>
            </div>

            <div className="pb-6 border-b border-border">
              <h3 className="text-lg font-semibold mb-2">What happens after they join?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Both people can view each other's profiles, see their posts in the feed, and start a private conversation. They're in control of how the connection develops from there.
              </p>
            </div>

            <div className="pb-6 border-b border-border">
              <h3 className="text-lg font-semibold mb-2">Do the suggested people know who introduced them?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes, if you provide your name when creating the match. The landing page and match dashboard will show who suggested the match and any personal message you included.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is there a limit to how many matches I can suggest?</h3>
              <p className="text-muted-foreground leading-relaxed">
                No limits. Suggest as many matches as you'd like. Spread the love!
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-3xl mx-auto text-center">
          <Card className="border-0 bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-950/20 dark:to-red-950/20">
            <CardContent className="p-12">
              <Heart className="h-12 w-12 mx-auto mb-6 text-pink-500" />
              <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
                Ready to Play Cupid?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Think of two people who'd be perfect together? Create a match in under a minute and watch the magic unfold.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/suggest-match">
                  <Button size="lg" className="gap-2 text-base px-8">
                    <Heart className="h-4 w-4" />
                    Suggest a Match
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg" variant="outline" className="text-base px-8">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
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
