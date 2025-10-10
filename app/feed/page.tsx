"use client"

import { PostCard } from "@/components/post-card"
import { MobileNav } from "@/components/mobile-nav"
import { DesktopNav } from "@/components/desktop-nav"
import { LogoText } from "@/components/logo"
import { usePosts } from "@/lib/posts-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, LogIn } from "lucide-react"
import { QuarantineBanner } from "@/components/quarantine-banner"
import { PostFilters } from "@/components/post-filters"
import Link from "next/link"

export default function FeedPage() {
  const { filteredPosts, showFilters } = usePosts()
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <LogoText />
          </Link>
          <DesktopNav />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {user?.isQuarantined && <QuarantineBanner />}

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Feed Header */}
          <div>
            <h1 className="text-2xl font-light font-serif">Feed</h1>
            <p className="text-sm text-muted-foreground">
              {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
            </p>
          </div>

          {showFilters && (
            <div className="bg-card border border-border rounded-lg p-4">
              <PostFilters />
            </div>
          )}

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No posts found matching your filters.</p>
                <p className="text-sm mt-2">Try adjusting your filters or create a new post!</p>
              </div>
            ) : (
              filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}
