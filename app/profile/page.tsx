"use client"

import { MobileNav } from "@/components/mobile-nav"
import { DesktopNav } from "@/components/desktop-nav"
import { LogoText } from "@/components/logo"
import { useAuth } from "@/lib/auth-context"
import { ProfileImageCard } from "@/components/profile-image-card"
import { ProfileEditCard } from "@/components/profile-edit-card"
import { MediaPermissionsCard } from "@/components/media-permissions-card"
import { DeleteAccountCard } from "@/components/delete-account-card"

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <LogoText />
          <DesktopNav />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        <h1 className="text-2xl font-light font-serif">Profile Settings</h1>

        <ProfileImageCard />
        <ProfileEditCard />
        <MediaPermissionsCard />
        <DeleteAccountCard />
      </div>

      <MobileNav />
    </div>
  )
}
