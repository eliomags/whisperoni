"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { usePosts } from "@/lib/posts-context"
import { useAuth } from "@/lib/auth-context"

export function CreatePostDialog({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const { createPost } = usePosts()
  const { user } = useAuth()

  const handleSubmit = () => {
    if (content.trim()) {
      createPost(content)
      setContent("")
      setOpen(false)
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {compact ? (
          <button className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-muted-foreground hover:text-foreground transition-colors">
            <Plus className="h-5 w-5" />
            <span className="text-xs font-medium">New Post</span>
          </button>
        ) : (
          <Button size="lg" className="gap-2 shadow-lg">
            <Plus className="h-5 w-5" />
            New Post
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
          <DialogDescription>Share what's on your mind. No images or videos, just your thoughts.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="What would you like to share?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px] resize-none"
            maxLength={500}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Your post will be tagged with: {user.gender}, {user.orientation}, {user.location}
            </span>
            <span>{content.length}/500</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!content.trim()}>
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
