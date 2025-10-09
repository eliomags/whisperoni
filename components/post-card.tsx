"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, MapPin } from "lucide-react"
import type { Post } from "@/lib/posts-context"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useChat } from "@/lib/chat-context"

type PostCardProps = {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter()
  const { user, getUserById } = useAuth()
  const { toast } = useToast()
  const { createChat } = useChat()

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

  const handleStartChat = () => {
    if (!user) {
      router.push("/auth")
      return
    }

    if (user.isQuarantined) {
      toast({
        title: "Cannot start chat",
        description: "Your account is under review. You can only chat with administrators.",
        variant: "destructive",
      })
      return
    }

    createChat(post.userId, post.id)
    router.push(`/chat/${post.userId}?postId=${post.id}`)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={postUser?.profileImageUrl || undefined} alt={post.userName} />
            <AvatarFallback>{getInitials(post.userName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg">{post.userName}</h3>
              <span className="text-xs text-muted-foreground">{formatTimeAgo(post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{post.location}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-foreground leading-relaxed">{post.content}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-3 border-t">
        <div className="flex gap-2">
          <Badge variant="secondary" className="capitalize">
            {post.userGender}
          </Badge>
          <Badge variant="secondary" className="capitalize">
            {post.userOrientation}
          </Badge>
        </div>
        <Button onClick={handleStartChat} size="sm" className="gap-2" disabled={user?.isQuarantined}>
          <MessageCircle className="h-4 w-4" />
          Chat
        </Button>
      </CardFooter>
    </Card>
  )
}
