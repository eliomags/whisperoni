"use client"

import { MobileNav } from "@/components/mobile-nav"
import { DesktopNav } from "@/components/desktop-nav"
import { LogoText } from "@/components/logo"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import { useChat } from "@/lib/chat-context"
import { ChatListItem } from "@/components/chat-list-item"

export default function ChatsPage() {
  const { getUserChats } = useChat()
  const userChats = getUserChats()

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <LogoText />
          <DesktopNav />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-2xl font-light font-serif mb-6">Chats</h1>

        {userChats.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No chats yet</p>
              <p className="text-sm text-muted-foreground mt-2">Start a conversation from the feed!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {userChats.map((chat) => (
              <ChatListItem key={chat.id} chat={chat} />
            ))}
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  )
}
