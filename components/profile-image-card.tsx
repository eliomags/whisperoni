"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { Camera, X } from "lucide-react"

export function ProfileImageCard() {
  const { user, updateProfile } = useAuth()
  const [imageUrl, setImageUrl] = useState(user?.profileImageUrl || "")
  const [hasChanges, setHasChanges] = useState(false)

  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    setImageUrl(newUrl)
    setHasChanges(newUrl !== (user.profileImageUrl || ""))
  }

  const handleSave = () => {
    updateProfile({ profileImageUrl: imageUrl || null })
    setHasChanges(false)
  }

  const handleRemove = () => {
    setImageUrl("")
    setHasChanges(true)
  }

  const handleCancel = () => {
    setImageUrl(user.profileImageUrl || "")
    setHasChanges(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Image</CardTitle>
        <CardDescription>
          Add a profile image to personalize your account. You can use a direct image URL.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={imageUrl || undefined} alt={user.name} />
            <AvatarFallback className="text-2xl">
              {user.name ? getInitials(user.name) : "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="Enter image URL (e.g., https://example.com/photo.jpg)"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {imageUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleRemove}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              For testing, try: https://i.pravatar.cc/150?img=1
            </p>
          </div>
        </div>

        {hasChanges && (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              <Camera className="mr-2 h-4 w-4" />
              Save Image
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
