"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useChat } from "@/lib/chat-context"
import { useAuth } from "@/lib/auth-context"
import { Mic, Video, Phone, VideoIcon, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type ChatPermissionsDialogProps = {
  chatId: string
  otherUserName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChatPermissionsDialog({ chatId, otherUserName, open, onOpenChange }: ChatPermissionsDialogProps) {
  const { user } = useAuth()
  const { chats, getChatPermissions, updateChatPermissions } = useChat()

  const [myPermissions, setMyPermissions] = useState({
    allowAudioMessages: false,
    allowVideoMessages: false,
    allowAudioCalls: false,
    allowVideoCalls: false,
  })

  const [otherPermissions, setOtherPermissions] = useState({
    allowAudioMessages: false,
    allowVideoMessages: false,
    allowAudioCalls: false,
    allowVideoCalls: false,
  })

  useEffect(() => {
    if (user && chatId) {
      const myPerms = getChatPermissions(chatId, user.id)
      if (myPerms) setMyPermissions(myPerms)

      // Get other user's permissions
      const chat = chats.find((c) => c.id === chatId)
      const otherUserId = chat?.participants.find((id) => id !== user.id)
      if (otherUserId) {
        const otherPerms = getChatPermissions(chatId, otherUserId)
        if (otherPerms) setOtherPermissions(otherPerms)
      }
    }
  }, [user, chatId, getChatPermissions, open, chats])

  const handleToggle = (key: keyof typeof myPermissions, value: boolean) => {
    if (!user) return
    const newPermissions = { ...myPermissions, [key]: value }
    setMyPermissions(newPermissions)
    updateChatPermissions(chatId, user.id, { [key]: value })
  }

  const canUseAudioMessages = myPermissions.allowAudioMessages && otherPermissions.allowAudioMessages
  const canUseVideoMessages = myPermissions.allowVideoMessages && otherPermissions.allowVideoMessages
  const canUseAudioCalls = myPermissions.allowAudioCalls && otherPermissions.allowAudioCalls
  const canUseVideoCalls = myPermissions.allowVideoCalls && otherPermissions.allowVideoCalls

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chat Permissions</DialogTitle>
          <DialogDescription>
            Control what media you allow in this chat. Both users must enable a feature for it to work.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Audio Messages */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mic className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label htmlFor="audio-messages" className="text-base">
                    Audio Messages
                  </Label>
                  <p className="text-xs text-muted-foreground">Send and receive voice messages</p>
                </div>
              </div>
              <Switch
                id="audio-messages"
                checked={myPermissions.allowAudioMessages}
                onCheckedChange={(checked) => handleToggle("allowAudioMessages", checked)}
              />
            </div>
            {!canUseAudioMessages && myPermissions.allowAudioMessages && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Waiting for {otherUserName} to enable audio messages
                </AlertDescription>
              </Alert>
            )}
            {canUseAudioMessages && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-xs text-green-600">Audio messages enabled</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Video Messages */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Video className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label htmlFor="video-messages" className="text-base">
                    Video Messages
                  </Label>
                  <p className="text-xs text-muted-foreground">Send and receive video messages</p>
                </div>
              </div>
              <Switch
                id="video-messages"
                checked={myPermissions.allowVideoMessages}
                onCheckedChange={(checked) => handleToggle("allowVideoMessages", checked)}
              />
            </div>
            {!canUseVideoMessages && myPermissions.allowVideoMessages && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Waiting for {otherUserName} to enable video messages
                </AlertDescription>
              </Alert>
            )}
            {canUseVideoMessages && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-xs text-green-600">Video messages enabled</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Audio Calls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label htmlFor="audio-calls" className="text-base">
                    Audio Calls
                  </Label>
                  <p className="text-xs text-muted-foreground">Make and receive voice calls</p>
                </div>
              </div>
              <Switch
                id="audio-calls"
                checked={myPermissions.allowAudioCalls}
                onCheckedChange={(checked) => handleToggle("allowAudioCalls", checked)}
              />
            </div>
            {!canUseAudioCalls && myPermissions.allowAudioCalls && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Waiting for {otherUserName} to enable audio calls
                </AlertDescription>
              </Alert>
            )}
            {canUseAudioCalls && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-xs text-green-600">Audio calls enabled</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Video Calls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <VideoIcon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label htmlFor="video-calls" className="text-base">
                    Video Calls
                  </Label>
                  <p className="text-xs text-muted-foreground">Make and receive video calls</p>
                </div>
              </div>
              <Switch
                id="video-calls"
                checked={myPermissions.allowVideoCalls}
                onCheckedChange={(checked) => handleToggle("allowVideoCalls", checked)}
              />
            </div>
            {!canUseVideoCalls && myPermissions.allowVideoCalls && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Waiting for {otherUserName} to enable video calls
                </AlertDescription>
              </Alert>
            )}
            {canUseVideoCalls && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-xs text-green-600">Video calls enabled</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
