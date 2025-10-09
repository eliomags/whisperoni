"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import type { User } from "@/lib/auth-context"

type ProfileDialogProps = {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDialog({ user, open, onOpenChange }: ProfileDialogProps) {
  if (!user) return null

  const getInitials = (name: string) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profileImageUrl || undefined} alt={user.name} />
              <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{user.location}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Gender & Orientation</p>
              <div className="flex gap-2">
                <Badge variant="secondary" className="capitalize">
                  {user.gender}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {user.orientation}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Media Permissions</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${user.mediaPermissions.allowAudioMessages ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span>Audio Messages</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${user.mediaPermissions.allowVideoMessages ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span>Video Messages</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${user.mediaPermissions.allowAudioCalls ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span>Audio Calls</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${user.mediaPermissions.allowVideoCalls ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span>Video Calls</span>
                </div>
              </div>
            </div>

            {user.isAdmin && (
              <div>
                <Badge variant="destructive">Administrator</Badge>
              </div>
            )}

            {user.isQuarantined && (
              <div>
                <Badge variant="destructive">Account Under Review</Badge>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
