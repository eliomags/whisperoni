"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, ChevronUp, MapPin, MessageSquare, FileEdit } from "lucide-react"
import { MessageBubble } from "@/components/message-bubble"
import { ChatInput } from "@/components/chat-input"
import { useAuth } from "@/lib/auth-context"
import type { Thread } from "@/lib/chat-context"
import type { Post } from "@/lib/posts-context"

type ThreadViewProps = {
  thread: Thread
  post: Post
  chatId: string
  currentUserId: string
  isCollapsed: boolean
  onToggleCollapse: () => void
  canSendAudio: boolean
  canSendVideo: boolean
}

export function ThreadView({
  thread,
  post,
  chatId,
  currentUserId,
  isCollapsed,
  onToggleCollapse,
  canSendAudio,
  canSendVideo,
}: ThreadViewProps) {
  const { getUserById } = useAuth()

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    if (seconds < 60) return "just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const postUser = getUserById(post.userId)

  return (
    <Card className="border-2">
      {/* Thread Header - Post Reference */}
      <CardHeader className="pb-3 cursor-pointer hover:bg-accent/50 transition-colors" onClick={onToggleCollapse}>
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={postUser?.profileImageUrl || undefined} alt={post.userName} />
            <AvatarFallback>{getInitials(post.userName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>Discussion about {post.userName}'s post</span>
              <span className="text-xs">• {formatTimeAgo(thread.lastActivity)}</span>
              {thread.isDraft && (
                <Badge variant="outline" className="h-5 px-1.5 text-xs flex items-center gap-1">
                  <FileEdit className="h-3 w-3" />
                  Draft
                </Badge>
              )}
            </div>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">{post.userName}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{post.location}</span>
                </div>
              </div>
            </div>
            {!isCollapsed && (
              <>
                <p className="text-sm leading-relaxed">{post.content}</p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="capitalize text-xs">
                    {post.userGender}
                  </Badge>
                  <Badge variant="secondary" className="capitalize text-xs">
                    {post.userOrientation}
                  </Badge>
                </div>
              </>
            )}
          </div>
          <Button variant="ghost" size="icon" className="shrink-0">
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {/* Thread Messages */}
      {!isCollapsed && (
        <>
          <CardContent className="space-y-4 pt-0">
            {thread.messages.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                {thread.isDraft ? (
                  <p>Send a message to start this conversation!</p>
                ) : (
                  <p>Start the discussion about this post!</p>
                )}
              </div>
            ) : (
              thread.messages.map((message) => (
                <MessageBubble key={message.id} message={message} isOwn={message.senderId === currentUserId} />
              ))
            )}
          </CardContent>

          {/* Thread Input */}
          <div className="border-t">
            <ChatInput
              chatId={chatId}
              threadId={thread.id}
              canSendAudio={canSendAudio}
              canSendVideo={canSendVideo}
              placeholder="Reply to this thread..."
            />
          </div>
        </>
      )}
    </Card>
  )
}
