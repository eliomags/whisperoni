"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, User, Clock, CheckCircle, Loader2, Eye } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { DesktopNav } from "@/components/desktop-nav"
import { LogoText } from "@/components/logo"

type Match = {
  id: string
  status: string
  suggesterName: string | null
  message: string | null
  createdAt: string
  otherUser: {
    id: string
    name: string
    phone: string
  } | null
}

export default function MatchesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }
    fetchMatches()
  }, [user, router])

  const fetchMatches = async () => {
    if (!user) return

    try {
      const res = await fetch(`/api/match/user/${user.id}`)
      const data = await res.json()

      if (res.ok) {
        setMatches(data.matches)
      }
    } catch (error) {
      console.error("Failed to fetch matches:", error)
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

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <LogoText />
          <h1 className="text-xl font-semibold md:hidden">Your Matches</h1>
          <DesktopNav />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-4">
        {matches.length > 0 ? (
          matches.map((match) => <MatchCard key={match.id} match={match} />)
        ) : (
          <Card className="p-12 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No matches yet</h3>
            <p className="text-muted-foreground mb-4">When friends suggest matches for you, they'll appear here</p>
            <Button onClick={() => router.push("/suggest-match")}>
              <Heart className="mr-2 h-4 w-4" />
              Suggest a Match for Friends
            </Button>
          </Card>
        )}
      </div>

      <MobileNav />
    </div>
  )
}

function MatchCard({ match }: { match: Match }) {
  const router = useRouter()
  const { getUserById } = useAuth()
  const isPending = match.status === "pending" || match.status === "one_joined"
  const isBothJoined = match.status === "both_joined"

  const getInitials = (name: string) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Get full user data if available
  const otherUserFull = match.otherUser ? getUserById(match.otherUser.id) : null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {match.otherUser && isBothJoined ? (
              <>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={otherUserFull?.profileImageUrl || undefined} />
                  <AvatarFallback>{getInitials(match.otherUser.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{match.otherUser.name || "Your Match"}</h3>
                  <p className="text-sm text-muted-foreground">
                    Suggested by {match.suggesterName || "a friend"}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Someone Special</h3>
                  <p className="text-sm text-muted-foreground">
                    Suggested by {match.suggesterName || "a friend"}
                  </p>
                </div>
              </>
            )}
          </div>
          {isPending ? (
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          ) : (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {match.message && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm italic">"{match.message}"</p>
          </div>
        )}

        {isPending ? (
          <p className="text-sm text-muted-foreground">We'll notify you when they join Whisperoni</p>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                // Navigate to feed with filter for this user
                router.push(`/feed?user=${match.otherUser?.id}`)
              }}
              variant="outline"
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Posts
            </Button>
            <Button onClick={() => router.push(`/chat/${match.otherUser?.id}`)} className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Chat
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
