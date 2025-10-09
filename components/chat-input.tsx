"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Mic, Video } from "lucide-react"
import { useChat } from "@/lib/chat-context"

type ChatInputProps = {
  chatId: string
  threadId: string
  canSendAudio: boolean
  canSendVideo: boolean
  placeholder?: string
}

export function ChatInput({
  chatId,
  threadId,
  canSendAudio,
  canSendVideo,
  placeholder = "Type a message...",
}: ChatInputProps) {
  const [message, setMessage] = useState("")
  const { sendMessage } = useChat()

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(chatId, threadId, message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleAudioMessage = () => {
    if (canSendAudio) {
      sendMessage(chatId, threadId, "Audio message", "audio")
    }
  }

  const handleVideoMessage = () => {
    if (canSendVideo) {
      sendMessage(chatId, threadId, "Video message", "video")
    }
  }

  return (
    <div className="bg-card">
      <div className="p-4">
        <div className="flex gap-2 items-end">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAudioMessage}
              disabled={!canSendAudio}
              title={canSendAudio ? "Send audio message" : "Audio messages not allowed"}
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVideoMessage}
              disabled={!canSendVideo}
              title={canSendVideo ? "Send video message" : "Video messages not allowed"}
            >
              <Video className="h-5 w-5" />
            </Button>
          </div>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
          />
          <Button onClick={handleSend} disabled={!message.trim()} size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
