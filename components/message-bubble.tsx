"use client"

import { cn } from "@/lib/utils"
import type { Message } from "@/lib/chat-context"
import { Mic, Video } from "lucide-react"

type MessageBubbleProps = {
  message: Message
  isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2 shadow-sm",
          isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        )}
      >
        {message.type === "text" ? (
          <p className="text-sm leading-relaxed break-words">{message.content}</p>
        ) : (
          <div className="flex items-center gap-2">
            {message.type === "audio" ? <Mic className="h-4 w-4" /> : <Video className="h-4 w-4" />}
            <span className="text-sm">{message.type === "audio" ? "Audio message" : "Video message"}</span>
          </div>
        )}
        <span className={cn("text-xs mt-1 block", isOwn ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  )
}
