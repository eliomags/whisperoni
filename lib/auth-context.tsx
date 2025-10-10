"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type User = {
  id: string
  phone: string
  name: string
  gender: "male" | "female" | "other"
  orientation: "straight" | "gay" | "bisexual" | "other"
  location: string
  isQuarantined: boolean
  isAdmin: boolean
  mediaPermissions: {
    allowAudioMessages: boolean
    allowVideoMessages: boolean
    allowAudioCalls: boolean
    allowVideoCalls: boolean
  }
  profileImageUrl?: string | null
}

type AuthContextType = {
  user: User | null
  login: (phone: string, code: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  deleteAccount: () => void
  isAuthenticated: boolean
  needsProfileSetup: boolean
  getUserById: (userId: string) => User | undefined
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Dummy users for MVP testing
export const DUMMY_USERS: Record<string, User> = {
  "+1234567890": {
    id: "1",
    phone: "+1234567890",
    name: "Alex Johnson",
    gender: "male",
    orientation: "straight",
    location: "New York, NY",
    isQuarantined: false,
    isAdmin: false,
    mediaPermissions: {
      allowAudioMessages: true,
      allowVideoMessages: true,
      allowAudioCalls: true,
      allowVideoCalls: true,
    },
    profileImageUrl: "https://i.pravatar.cc/150?img=1",
  },
  "+1234567891": {
    id: "2",
    phone: "+1234567891",
    name: "Sarah Miller",
    gender: "female",
    orientation: "straight",
    location: "Los Angeles, CA",
    isQuarantined: false,
    isAdmin: false,
    mediaPermissions: {
      allowAudioMessages: true,
      allowVideoMessages: false,
      allowAudioCalls: true,
      allowVideoCalls: false,
    },
    profileImageUrl: "https://i.pravatar.cc/150?img=5",
  },
  "+1234567892": {
    id: "3",
    phone: "+1234567892",
    name: "Admin User",
    gender: "other",
    orientation: "other",
    location: "San Francisco, CA",
    isQuarantined: false,
    isAdmin: true,
    mediaPermissions: {
      allowAudioMessages: true,
      allowVideoMessages: true,
      allowAudioCalls: true,
      allowVideoCalls: true,
    },
  },
  "+1234567893": {
    id: "4",
    phone: "+1234567893",
    name: "Marcus Chen",
    gender: "male",
    orientation: "gay",
    location: "San Francisco, CA",
    isQuarantined: false,
    isAdmin: false,
    mediaPermissions: {
      allowAudioMessages: true,
      allowVideoMessages: true,
      allowAudioCalls: false,
      allowVideoCalls: false,
    },
    profileImageUrl: "https://i.pravatar.cc/150?img=12",
  },
  "+1234567894": {
    id: "5",
    phone: "+1234567894",
    name: "Emma Rodriguez",
    gender: "female",
    orientation: "bisexual",
    location: "Miami, FL",
    isQuarantined: false,
    isAdmin: false,
    mediaPermissions: {
      allowAudioMessages: false,
      allowVideoMessages: false,
      allowAudioCalls: true,
      allowVideoCalls: true,
    },
  },
  "+1234567895": {
    id: "6",
    phone: "+1234567895",
    name: "Jordan Taylor",
    gender: "other",
    orientation: "other",
    location: "Austin, TX",
    isQuarantined: false,
    isAdmin: false,
    mediaPermissions: {
      allowAudioMessages: true,
      allowVideoMessages: false,
      allowAudioCalls: true,
      allowVideoCalls: false,
    },
  },
  "+1234567896": {
    id: "7",
    phone: "+1234567896",
    name: "David Kim",
    gender: "male",
    orientation: "straight",
    location: "Seattle, WA",
    isQuarantined: false,
    isAdmin: false,
    mediaPermissions: {
      allowAudioMessages: true,
      allowVideoMessages: true,
      allowAudioCalls: true,
      allowVideoCalls: true,
    },
  },
  "+1234567897": {
    id: "8",
    phone: "+1234567897",
    name: "Lisa Anderson",
    gender: "female",
    orientation: "gay",
    location: "Portland, OR",
    isQuarantined: false,
    isAdmin: false,
    mediaPermissions: {
      allowAudioMessages: true,
      allowVideoMessages: true,
      allowAudioCalls: true,
      allowVideoCalls: true,
    },
  },
  "+1234567898": {
    id: "9",
    phone: "+1234567898",
    name: "Quarantined User",
    gender: "male",
    orientation: "straight",
    location: "Chicago, IL",
    isQuarantined: true,
    isAdmin: false,
    mediaPermissions: {
      allowAudioMessages: false,
      allowVideoMessages: false,
      allowAudioCalls: false,
      allowVideoCalls: false,
    },
  },
  "+1234567899": {
    id: "10",
    phone: "+1234567899",
    name: "Rachel Green",
    gender: "female",
    orientation: "straight",
    location: "Boston, MA",
    isQuarantined: false,
    isAdmin: false,
    mediaPermissions: {
      allowAudioMessages: true,
      allowVideoMessages: false,
      allowAudioCalls: false,
      allowVideoCalls: false,
    },
  },
  "+1111111111": {
    id: "11",
    phone: "+1111111111",
    name: "",
    gender: "male",
    orientation: "straight",
    location: "",
    isQuarantined: false,
    isAdmin: false,
    mediaPermissions: {
      allowAudioMessages: true,
      allowVideoMessages: true,
      allowAudioCalls: true,
      allowVideoCalls: true,
    },
    profileImageUrl: null,
  },
}

// Dummy verification codes (phone -> code)
export const VERIFICATION_CODES: Record<string, string> = {
  "+1234567890": "123456",
  "+1234567891": "123456",
  "+1234567892": "123456",
  "+1234567893": "123456",
  "+1234567894": "123456",
  "+1234567895": "123456",
  "+1234567896": "123456",
  "+1234567897": "123456",
  "+1234567898": "123456",
  "+1234567899": "123456",
  "+1111111111": "123456",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (phone: string, code: string): Promise<boolean> => {
    // Verify code
    if (VERIFICATION_CODES[phone] === code) {
      const userData = DUMMY_USERS[phone]
      if (userData) {
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem("user", JSON.stringify(userData))

        // Check for pending match token
        const matchToken = sessionStorage.getItem("matchToken")
        if (matchToken) {
          await linkUserToMatch(userData.id, phone, matchToken)
          sessionStorage.removeItem("matchToken")
        }

        return true
      }
    }
    return false
  }

  const linkUserToMatch = async (userId: string, phone: string, token: string) => {
    try {
      const res = await fetch(`/api/match/${token}/link`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, phone }),
      })

      if (res.ok) {
        const data = await res.json()

        // If both joined, could show a notification here
        if (data.bothJoined) {
          console.log("Match activated!", data.otherUser)
          // TODO: Show toast notification when both users have joined
        }
      }
    } catch (error) {
      console.error("Failed to link match:", error)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
    window.location.href = "/auth"
  }

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const deleteAccount = () => {
    logout()
    // In a real app, this would call an API to delete the account
  }

  const getUserById = (userId: string): User | undefined => {
    // If requesting the current logged-in user, return the updated user object
    if (user && user.id === userId) {
      return user
    }

    // Otherwise, look up from dummy users
    return Object.values(DUMMY_USERS).find((u) => u.id === userId)
  }

  const needsProfileSetup = user ? (user.name === "" || user.location === "") : false

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfile,
        deleteAccount,
        isAuthenticated,
        needsProfileSetup,
        getUserById,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
