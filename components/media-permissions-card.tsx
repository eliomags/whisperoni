"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { Mic, Video, Phone, VideoIcon } from "lucide-react"

export function MediaPermissionsCard() {
  const { user, updateProfile } = useAuth()

  if (!user) return null

  const handlePermissionChange = (permission: keyof typeof user.mediaPermissions, value: boolean) => {
    updateProfile({
      mediaPermissions: {
        ...user.mediaPermissions,
        [permission]: value,
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Permissions</CardTitle>
        <CardDescription>
          Control what types of media you can send and receive. Both users must allow a feature for it to work.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Mic className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Label htmlFor="audio-messages" className="text-base font-medium">
                Audio Messages
              </Label>
              <p className="text-sm text-muted-foreground">Send and receive voice messages</p>
            </div>
          </div>
          <Switch
            id="audio-messages"
            checked={user.mediaPermissions.allowAudioMessages}
            onCheckedChange={(checked) => handlePermissionChange("allowAudioMessages", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Video className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Label htmlFor="video-messages" className="text-base font-medium">
                Video Messages
              </Label>
              <p className="text-sm text-muted-foreground">Send and receive video messages</p>
            </div>
          </div>
          <Switch
            id="video-messages"
            checked={user.mediaPermissions.allowVideoMessages}
            onCheckedChange={(checked) => handlePermissionChange("allowVideoMessages", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Label htmlFor="audio-calls" className="text-base font-medium">
                Audio Calls
              </Label>
              <p className="text-sm text-muted-foreground">Make and receive voice calls</p>
            </div>
          </div>
          <Switch
            id="audio-calls"
            checked={user.mediaPermissions.allowAudioCalls}
            onCheckedChange={(checked) => handlePermissionChange("allowAudioCalls", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <VideoIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Label htmlFor="video-calls" className="text-base font-medium">
                Video Calls
              </Label>
              <p className="text-sm text-muted-foreground">Make and receive video calls</p>
            </div>
          </div>
          <Switch
            id="video-calls"
            checked={user.mediaPermissions.allowVideoCalls}
            onCheckedChange={(checked) => handlePermissionChange("allowVideoCalls", checked)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
