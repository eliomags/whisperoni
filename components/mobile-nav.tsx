"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, MessageSquare, User, Filter, PlusCircle, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { CreatePostDialog } from "@/components/create-post-dialog"
import { useAuth } from "@/lib/auth-context"
import { usePosts } from "@/lib/posts-context"

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { showFilters, setShowFilters } = usePosts()

  const handleProtectedClick = (e: React.MouseEvent, href: string) => {
    if (!isAuthenticated) {
      e.preventDefault()
      router.push("/auth")
    }
  }

  const links = [
    { href: "/feed", label: "Feed", icon: Home, public: true },
    { href: "/chats", label: "Chats", icon: MessageSquare, public: false },
    { href: "/matches", label: "Matches", icon: Heart, public: false },
    { href: "/profile", label: "Profile", icon: User, public: false },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname.startsWith(link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => !link.public && handleProtectedClick(e, link.href)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{link.label}</span>
            </Link>
          )
        })}

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
            showFilters ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Filter className="h-5 w-5" />
          <span className="text-xs font-medium">Filters</span>
        </button>

        {isAuthenticated && !user?.isQuarantined ? (
          <CreatePostDialog compact />
        ) : (
          <button
            onClick={() => router.push("/auth")}
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="text-xs font-medium">New Post</span>
          </button>
        )}
      </div>
    </nav>
  )
}
