"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useAuth } from "./auth-context"

export type Report = {
  id: string
  reporterId: string
  reportedUserId: string
  reason: string
  timestamp: Date
  status: "pending" | "resolved" | "dismissed"
}

type ModerationContextType = {
  reports: Report[]
  reportUser: (userId: string, reason: string) => void
  quarantineUser: (userId: string) => void
  clearUser: (userId: string) => void
  isUserQuarantined: (userId: string) => boolean
  resolveReport: (reportId: string, action: "quarantine" | "dismiss") => void
}

const ModerationContext = createContext<ModerationContextType | undefined>(undefined)

export function ModerationProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>([])
  const [quarantinedUsers, setQuarantinedUsers] = useState<Set<string>>(new Set())
  const { user, updateProfile } = useAuth()

  const reportUser = (userId: string, reason: string) => {
    if (!user) return

    const newReport: Report = {
      id: `report-${Date.now()}`,
      reporterId: user.id,
      reportedUserId: userId,
      reason,
      timestamp: new Date(),
      status: "pending",
    }

    setReports([newReport, ...reports])
  }

  const quarantineUser = (userId: string) => {
    setQuarantinedUsers(new Set([...quarantinedUsers, userId]))

    // If it's the current user, update their profile
    if (user && user.id === userId) {
      updateProfile({ isQuarantined: true })
    }
  }

  const clearUser = (userId: string) => {
    const newQuarantined = new Set(quarantinedUsers)
    newQuarantined.delete(userId)
    setQuarantinedUsers(newQuarantined)

    // If it's the current user, update their profile
    if (user && user.id === userId) {
      updateProfile({ isQuarantined: false })
    }
  }

  const isUserQuarantined = (userId: string): boolean => {
    return quarantinedUsers.has(userId)
  }

  const resolveReport = (reportId: string, action: "quarantine" | "dismiss") => {
    const report = reports.find((r) => r.id === reportId)
    if (!report) return

    if (action === "quarantine") {
      quarantineUser(report.reportedUserId)
    }

    setReports(
      reports.map((r) =>
        r.id === reportId ? { ...r, status: action === "quarantine" ? "resolved" : "dismissed" } : r,
      ),
    )
  }

  return (
    <ModerationContext.Provider
      value={{
        reports,
        reportUser,
        quarantineUser,
        clearUser,
        isUserQuarantined,
        resolveReport,
      }}
    >
      {children}
    </ModerationContext.Provider>
  )
}

export function useModeration() {
  const context = useContext(ModerationContext)
  if (context === undefined) {
    throw new Error("useModeration must be used within a ModerationProvider")
  }
  return context
}
