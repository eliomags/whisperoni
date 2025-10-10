"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Loader2, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

type MatchData = {
  matchId: string
  personNumber: number
  suggesterName: string | null
  message: string | null
  otherPersonName: string | null
  status: string
  createdAt: string
}

export default function MatchLandingPage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [token, setToken] = useState<string>("")
  const [match, setMatch] = useState<MatchData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    params.then((p) => setToken(p.token))
  }, [params])

  useEffect(() => {
    if (token) {
      fetchMatch()
    }
  }, [token])

  useEffect(() => {
    if (isAuthenticated && match) {
      // User is logged in - redirect to matches page
      router.push("/matches")
    }
  }, [isAuthenticated, match, router])

  const fetchMatch = async () => {
    try {
      const res = await fetch(`/api/match/${token}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setMatch(data)

      // Store token in sessionStorage for auth flow
      sessionStorage.setItem("matchToken", token)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Match Not Found</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-background dark:from-pink-950/20 py-12">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="text-center mb-8">
          <div className="h-20 w-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Heart className="h-10 w-10 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3">You've Been Matched!</h1>
          <p className="text-lg text-muted-foreground">
            {match?.suggesterName ? (
              <>
                <span className="font-semibold">{match.suggesterName}</span> thinks you'd be a great match with someone
                special
              </>
            ) : (
              "A friend thinks you'd be a great match with someone special"
            )}
          </p>
        </div>

        <Card className="p-6 mb-6">
          <div className="space-y-4">
            {match?.message && (
              <div className="p-4 bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-950/20 dark:to-red-950/20 rounded-lg border border-pink-200 dark:border-pink-800">
                <p className="text-sm text-muted-foreground mb-1">Message from your matchmaker:</p>
                <p className="italic font-medium">"{match.message}"</p>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Here's how it works:</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div className="pt-1">
                    <p className="text-sm">Sign up to Whisperoni with your phone number</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div className="pt-1">
                    <p className="text-sm">We'll notify you when your match joins</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div className="pt-1">
                    <p className="text-sm">View their profile, browse their posts, and start chatting!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Button onClick={() => router.push("/auth")} className="w-full" size="lg">
          <Heart className="mr-2 h-4 w-4" />
          Join Whisperoni & Meet Your Match
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Free to join " No credit card required " Your match is waiting
        </p>
      </div>
    </div>
  )
}
