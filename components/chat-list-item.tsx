"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import type { Chat } from "@/lib/chat-context"
import { useChat } from "@/lib/chat-context"
import { useAuth } from "@/lib/auth-context"
import { FileEdit } from "lucide-react"

type ChatListItemProps = {
  chat: Chat
}

export function ChatListItem({ chat }: ChatListItemProps) {
  const router = useRouter()
  const { getOtherUser } = useChat()
  const { getUserById } = useAuth()
  const otherUser = getOtherUser(chat.id)

  if (!otherUser) return null

  const mostRecentThread = chat.threads.reduce((latest, thread) => {
    return thread.lastActivity > latest.lastActivity ? thread : latest
  }, chat.threads[0])

  const lastMessage = mostRecentThread?.messages[mostRecentThread.messages.length - 1]
  const isDraft = mostRecentThread?.isDraft

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    if (seconds < 60) return "just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
    return `${Math.floor(seconds / 86400)}d`
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const otherUserProfile = getUserById(otherUser.id)

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => router.push(`/chat/${otherUser.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={otherUserProfile?.profileImageUrl || undefined} alt={otherUser.name} />
            <AvatarFallback>{getInitials(otherUser.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{otherUser.name}</h3>
              {chat.unreadCount > 0 && (
                <Badge variant="default" className="h-5 min-w-5 px-1.5 text-xs">
                  {chat.unreadCount}
                </Badge>
              )}
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {chat.threads.length} {chat.threads.length === 1 ? "thread" : "threads"}
              </Badge>
              {isDraft && (
                <Badge variant="outline" className="h-5 px-1.5 text-xs flex items-center gap-1">
                  <FileEdit className="h-3 w-3" />
                  Draft
                </Badge>
              )}
            </div>
            {lastMessage ? (
              <p className="text-sm text-muted-foreground truncate">
                {lastMessage.type === "text" ? lastMessage.content : `[${lastMessage.type} message]`}
              </p>
            ) : isDraft ? (
              <p className="text-sm text-muted-foreground italic">No messages yet</p>
            ) : null}
          </div>
          {mostRecentThread && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatTimeAgo(mostRecentThread.lastActivity)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
