"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Phone, Video, MoreVertical, Settings } from "lucide-react"
import { useChat } from "@/lib/chat-context"
import { useAuth, DUMMY_USERS } from "@/lib/auth-context"
import { usePosts } from "@/lib/posts-context"
import { ThreadView } from "@/components/thread-view"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ReportDialog } from "@/components/report-dialog"
import { ChatPermissionsDialog } from "@/components/chat-permissions-dialog"

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { chats, createChat, markAsRead, getChatPermissions, getChat, toggleThreadCollapse } = useChat()
  const { getPost } = usePosts()
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false)
  const [chatId, setChatId] = useState<string>("")

  const otherUserId = params.userId as string
  const otherUser = Object.values(DUMMY_USERS).find((u) => u.id === otherUserId)

  useEffect(() => {
    if (user && otherUserId) {
      const urlParams = new URLSearchParams(window.location.search)
      const postId = urlParams.get("postId")

      if (postId) {
        const { chatId: newChatId } = createChat(otherUserId, postId)
        setChatId(newChatId)
      } else {
        const existingChat = chats.find(
          (chat) => chat.participants.includes(user.id) && chat.participants.includes(otherUserId),
        )
        if (existingChat) {
          setChatId(existingChat.id)
        }
      }
    }
  }, [user, otherUserId, createChat, chats])

  const chat = getChat(chatId)

  useEffect(() => {
    if (chatId) {
      markAsRead(chatId)
    }
  }, [chatId, markAsRead])

  if (!user || !otherUser || !chat) {
    return null
  }

  const sortedThreads = [...chat.threads].sort((a, b) => a.lastActivity.getTime() - b.lastActivity.getTime())

  const myPermissions = getChatPermissions(chatId, user.id)
  const otherPermissions = getChatPermissions(chatId, otherUserId)

  const canSendAudio = myPermissions?.allowAudioMessages && otherPermissions?.allowAudioMessages
  const canSendVideo = myPermissions?.allowVideoMessages && otherPermissions?.allowVideoMessages
  const canAudioCall = myPermissions?.allowAudioCalls && otherPermissions?.allowAudioCalls
  const canVideoCall = myPermissions?.allowVideoCalls && otherPermissions?.allowVideoCalls

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="font-semibold">{otherUser.name}</h2>
              <p className="text-xs text-muted-foreground">
                {chat.threads.length} {chat.threads.length === 1 ? "discussion" : "discussions"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              disabled={!canAudioCall}
              title={canAudioCall ? "Audio call" : "Audio calls not enabled by both users"}
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={!canVideoCall}
              title={canVideoCall ? "Video call" : "Video calls not enabled by both users"}
            >
              <Video className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setPermissionsDialogOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Chat Permissions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setReportDialogOpen(true)} className="text-destructive">
                  Report User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Threads */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 space-y-4 max-w-3xl">
          {sortedThreads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No discussions yet</p>
              <p className="text-sm mt-2">Start a conversation about a post with {otherUser.name}</p>
            </div>
          ) : (
            sortedThreads.map((thread) => {
              const post = getPost(thread.postId)
              if (!post) return null

              return (
                <ThreadView
                  key={thread.id}
                  thread={thread}
                  post={post}
                  chatId={chatId}
                  currentUserId={user.id}
                  isCollapsed={thread.isCollapsed}
                  onToggleCollapse={() => toggleThreadCollapse(chatId, thread.id)}
                  canSendAudio={canSendAudio || false}
                  canSendVideo={canSendVideo || false}
                />
              )
            })
          )}
        </div>
      </div>

      <ReportDialog
        userId={otherUserId}
        userName={otherUser.name}
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
      />

      <ChatPermissionsDialog
        chatId={chatId}
        otherUserName={otherUser.name}
        open={permissionsDialogOpen}
        onOpenChange={setPermissionsDialogOpen}
      />
    </div>
  )
}
