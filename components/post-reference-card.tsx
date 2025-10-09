"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, MessageSquare } from "lucide-react"
import type { Post } from "@/lib/posts-context"

type PostReferenceCardProps = {
  post: Post
}

export function PostReferenceCard({ post }: PostReferenceCardProps) {
  return (
    <Card className="bg-accent/50 border-accent">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>Chat started from this post</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="font-semibold">{post.userName}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{post.location}</span>
            </div>
          </div>
        </div>
        <p className="text-sm leading-relaxed">{post.content}</p>
        <div className="flex gap-2">
          <Badge variant="secondary" className="capitalize text-xs">
            {post.userGender}
          </Badge>
          <Badge variant="secondary" className="capitalize text-xs">
            {post.userOrientation}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
