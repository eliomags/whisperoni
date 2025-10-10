"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, MessageSquare, User, Heart, Filter, PlusCircle, LogOut, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { usePosts } from "@/lib/posts-context"
import { CreatePostDialog } from "@/components/create-post-dialog"

export function DesktopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const { showFilters, setShowFilters } = usePosts()

  const handleProtectedClick = (e: React.MouseEvent, href: string) => {
    if (!isAuthenticated) {
      e.preventDefault()
      router.push("/auth")
    }
  }

  const handleFiltersClick = () => {
    if (!pathname.startsWith("/feed")) {
      router.push("/feed")
    }
    setShowFilters(!showFilters)
  }

  const links = [
    { href: "/feed", label: "Feed", icon: Home, public: true },
    { href: "/chats", label: "Chats", icon: MessageSquare, public: false },
    { href: "/matches", label: "Matches", icon: Heart, public: false },
    { href: "/profile", label: "Profile", icon: User, public: false },
  ]

  return (
    <nav className="hidden md:flex items-center gap-2">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname.startsWith(link.href)

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={(e) => !link.public && handleProtectedClick(e, link.href)}
          >
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={cn("gap-2", isActive && "pointer-events-none")}
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Button>
          </Link>
        )
      })}

      <Button
        variant={showFilters && pathname.startsWith("/feed") ? "default" : "ghost"}
        size="sm"
        onClick={handleFiltersClick}
        className="gap-2"
      >
        <Filter className="h-4 w-4" />
        <span>Filters</span>
      </Button>

      {isAuthenticated && !user?.isQuarantined ? (
        <CreatePostDialog />
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/auth")}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden lg:inline">New Post</span>
        </Button>
      )}

      {isAuthenticated ? (
        <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      ) : (
        <Link href="/auth">
          <Button variant="ghost" size="sm" className="gap-2">
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </Button>
        </Link>
      )}
    </nav>
  )
}
