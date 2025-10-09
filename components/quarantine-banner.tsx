"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function QuarantineBanner() {
  const router = useRouter()

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Account Under Review</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>Your account has been flagged and is currently under review. During this time:</p>
        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
          <li>You cannot start new chats</li>
          <li>Your posts are not visible to others</li>
          <li>You can only communicate with administrators</li>
        </ul>
        <Button variant="outline" size="sm" className="mt-3 bg-transparent" onClick={() => router.push("/admin-chat")}>
          Contact Admin
        </Button>
      </AlertDescription>
    </Alert>
  )
}
