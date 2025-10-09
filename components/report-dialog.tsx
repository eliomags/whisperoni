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
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useModeration } from "@/lib/moderation-context"
import { useToast } from "@/hooks/use-toast"

type ReportDialogProps = {
  userId: string
  userName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const REPORT_REASONS = ["Scam or fraud", "Inappropriate behavior", "Harassment", "Fake profile", "Spam", "Other"]

export function ReportDialog({ userId, userName, open, onOpenChange }: ReportDialogProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const { reportUser } = useModeration()
  const { toast } = useToast()

  const handleSubmit = () => {
    const reason = selectedReason === "Other" ? customReason : selectedReason

    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please select or enter a reason for reporting",
        variant: "destructive",
      })
      return
    }

    reportUser(userId, reason)
    toast({
      title: "Report submitted",
      description: `${userName} has been reported. Our team will review this case.`,
    })

    // Reset and close
    setSelectedReason("")
    setCustomReason("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report {userName}</DialogTitle>
          <DialogDescription>
            Help us keep the community safe. Your report will be reviewed by our moderation team.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label>Reason for reporting</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {REPORT_REASONS.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason} id={reason} />
                  <Label htmlFor={reason} className="font-normal cursor-pointer">
                    {reason}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {selectedReason === "Other" && (
            <div className="space-y-2">
              <Label htmlFor="custom-reason">Please specify</Label>
              <Textarea
                id="custom-reason"
                placeholder="Describe the issue..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="destructive">
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
