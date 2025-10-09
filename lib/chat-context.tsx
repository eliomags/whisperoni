"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { useAuth, DUMMY_USERS } from "./auth-context"

export type Message = {
  id: string
  threadId: string
  senderId: string
  content: string
  type: "text" | "audio" | "video"
  timestamp: Date
  isRead: boolean
}

export type Thread = {
  id: string
  chatId: string
  postId: string
  messages: Message[]
  lastActivity: Date
  isCollapsed: boolean
  isDraft: boolean
  createdBy: string
}

export type Chat = {
  id: string
  participants: string[]
  threads: Thread[]
  mediaPermissions: {
    [userId: string]: {
      allowAudioMessages: boolean
      allowVideoMessages: boolean
      allowAudioCalls: boolean
      allowVideoCalls: boolean
    }
  }
  unreadCount: number
  createdAt: Date
}

type ChatContextType = {
  chats: Chat[]
  sendMessage: (chatId: string, threadId: string, content: string, type?: "text" | "audio" | "video") => void
  createChat: (otherUserId: string, postId: string) => { chatId: string; threadId: string }
  createThread: (chatId: string, postId: string) => string
  markAsRead: (chatId: string) => void
  toggleThreadCollapse: (chatId: string, threadId: string) => void
  getOtherUser: (chatId: string) => { id: string; name: string; phone: string } | null
  updateChatPermissions: (
    chatId: string,
    userId: string,
    permissions: Partial<Chat["mediaPermissions"][string]>,
  ) => void
  getChatPermissions: (chatId: string, userId: string) => Chat["mediaPermissions"][string] | null
  getChat: (chatId: string) => Chat | null
  getThread: (chatId: string, threadId: string) => Thread | null
  getUserChats: () => Chat[]
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

const DUMMY_CHATS: Chat[] = [
  {
    id: "chat-1-2",
    participants: ["1", "2"],
    threads: [
      {
        id: "thread-1-2-post1",
        chatId: "chat-1-2",
        postId: "1",
        lastActivity: new Date(Date.now() - 30 * 60 * 1000),
        isCollapsed: false,
        isDraft: false,
        createdBy: "2",
        messages: [
          {
            id: "msg-1",
            threadId: "thread-1-2-post1",
            senderId: "2",
            content: "Hi! I saw your post about coffee shops. Have you tried Blue Bottle in Brooklyn?",
            type: "text",
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            isRead: true,
          },
          {
            id: "msg-2",
            threadId: "thread-1-2-post1",
            senderId: "1",
            content: "Not yet! Is it good? I'm always looking for new spots.",
            type: "text",
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            isRead: true,
          },
          {
            id: "msg-3",
            threadId: "thread-1-2-post1",
            senderId: "2",
            content: "It's amazing! Their cold brew is the best. We should check it out together sometime.",
            type: "text",
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            isRead: false,
          },
        ],
      },
    ],
    mediaPermissions: {
      "1": {
        allowAudioMessages: true,
        allowVideoMessages: true,
        allowAudioCalls: true,
        allowVideoCalls: true,
      },
      "2": {
        allowAudioMessages: false,
        allowVideoMessages: false,
        allowAudioCalls: true,
        allowVideoCalls: false,
      },
    },
    unreadCount: 1,
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: "chat-1-7",
    participants: ["1", "7"],
    threads: [
      {
        id: "thread-1-7-post8",
        chatId: "chat-1-7",
        postId: "8",
        lastActivity: new Date(Date.now() - 80 * 60 * 1000),
        isCollapsed: false,
        isDraft: false,
        createdBy: "7",
        messages: [
          {
            id: "msg-5",
            threadId: "thread-1-7-post8",
            senderId: "7",
            content: "Hey Alex! I'm also in the coffee scene. We should meet up!",
            type: "text",
            timestamp: new Date(Date.now() - 120 * 60 * 1000),
            isRead: true,
          },
          {
            id: "msg-6",
            threadId: "thread-1-7-post8",
            senderId: "1",
            content: "I'd love to. When are you free?",
            type: "text",
            timestamp: new Date(Date.now() - 100 * 60 * 1000),
            isRead: true,
          },
          {
            id: "msg-7",
            threadId: "thread-1-7-post8",
            senderId: "7",
            content: "How about this Saturday morning? There's a new place I want to try.",
            type: "text",
            timestamp: new Date(Date.now() - 80 * 60 * 1000),
            isRead: true,
          },
        ],
      },
    ],
    mediaPermissions: {
      "1": {
        allowAudioMessages: true,
        allowVideoMessages: true,
        allowAudioCalls: true,
        allowVideoCalls: true,
      },
      "7": {
        allowAudioMessages: true,
        allowVideoMessages: true,
        allowAudioCalls: true,
        allowVideoCalls: true,
      },
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 120 * 60 * 1000),
  },
  {
    id: "chat-2-5",
    participants: ["2", "5"],
    threads: [
      {
        id: "thread-2-5-post2",
        chatId: "chat-2-5",
        postId: "2",
        lastActivity: new Date(Date.now() - 180 * 60 * 1000),
        isCollapsed: false,
        isDraft: false,
        createdBy: "5",
        messages: [
          {
            id: "msg-8",
            threadId: "thread-2-5-post2",
            senderId: "5",
            content: "Love your hiking posts! I'm visiting LA next month, any trail recommendations?",
            type: "text",
            timestamp: new Date(Date.now() - 200 * 60 * 1000),
            isRead: true,
          },
          {
            id: "msg-9",
            threadId: "thread-2-5-post2",
            senderId: "2",
            content: "Yes! Runyon Canyon is great for beginners, but if you want a challenge, try the Backbone Trail!",
            type: "text",
            timestamp: new Date(Date.now() - 180 * 60 * 1000),
            isRead: true,
          },
        ],
      },
    ],
    mediaPermissions: {
      "2": {
        allowAudioMessages: true,
        allowVideoMessages: false,
        allowAudioCalls: true,
        allowVideoCalls: false,
      },
      "5": {
        allowAudioMessages: false,
        allowVideoMessages: false,
        allowAudioCalls: true,
        allowVideoCalls: true,
      },
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 200 * 60 * 1000),
  },
]

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(DUMMY_CHATS)
  const { user } = useAuth()

  const createChat = useCallback(
    (otherUserId: string, postId: string): { chatId: string; threadId: string } => {
      if (!user) return { chatId: "", threadId: "" }

      const existingChat = chats.find(
        (chat) => chat.participants.includes(user.id) && chat.participants.includes(otherUserId),
      )

      if (existingChat) {
        const existingThread = existingChat.threads.find((t) => t.postId === postId)

        if (existingThread) {
          return { chatId: existingChat.id, threadId: existingThread.id }
        }

        const newThreadId = `thread-${user.id}-${otherUserId}-post${postId}`
        const newThread: Thread = {
          id: newThreadId,
          chatId: existingChat.id,
          postId,
          messages: [],
          lastActivity: new Date(),
          isCollapsed: false,
          isDraft: true,
          createdBy: user.id,
        }

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === existingChat.id ? { ...chat, threads: [...chat.threads, newThread] } : chat,
          ),
        )

        return { chatId: existingChat.id, threadId: newThreadId }
      }

      const newChatId = `chat-${user.id}-${otherUserId}`
      const newThreadId = `thread-${user.id}-${otherUserId}-post${postId}`

      const newThread: Thread = {
        id: newThreadId,
        chatId: newChatId,
        postId,
        messages: [],
        lastActivity: new Date(),
        isCollapsed: false,
        isDraft: true,
        createdBy: user.id,
      }

      const newChat: Chat = {
        id: newChatId,
        participants: [user.id, otherUserId],
        threads: [newThread],
        mediaPermissions: {
          [user.id]: {
            allowAudioMessages: false,
            allowVideoMessages: false,
            allowAudioCalls: false,
            allowVideoCalls: false,
          },
          [otherUserId]: {
            allowAudioMessages: false,
            allowVideoMessages: false,
            allowAudioCalls: false,
            allowVideoCalls: false,
          },
        },
        unreadCount: 0,
        createdAt: new Date(),
      }

      setChats([newChat, ...chats])

      return { chatId: newChatId, threadId: newThreadId }
    },
    [user, chats],
  )

  const createThread = useCallback(
    (chatId: string, postId: string): string => {
      if (!user) return ""

      const chat = chats.find((c) => c.id === chatId)
      if (!chat) return ""

      const existingThread = chat.threads.find((t) => t.postId === postId)
      if (existingThread) return existingThread.id

      const otherUserId = chat.participants.find((id) => id !== user.id)
      const newThreadId = `thread-${user.id}-${otherUserId}-post${postId}`

      const newThread: Thread = {
        id: newThreadId,
        chatId,
        postId,
        messages: [],
        lastActivity: new Date(),
        isCollapsed: false,
        isDraft: true,
        createdBy: user.id,
      }

      setChats((prevChats) =>
        prevChats.map((c) => (c.id === chatId ? { ...c, threads: [...c.threads, newThread] } : c)),
      )

      return newThreadId
    },
    [user, chats],
  )

  const sendMessage = useCallback(
    (chatId: string, threadId: string, content: string, type: "text" | "audio" | "video" = "text") => {
      if (!user) return

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        threadId,
        senderId: user.id,
        content,
        type,
        timestamp: new Date(),
        isRead: false,
      }

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id !== chatId) return chat

          return {
            ...chat,
            threads: chat.threads.map((thread) => {
              if (thread.id !== threadId) return thread

              return {
                ...thread,
                messages: [...thread.messages, newMessage],
                lastActivity: new Date(),
                isDraft: false,
              }
            }),
          }
        }),
      )
    },
    [user],
  )

  const toggleThreadCollapse = useCallback((chatId: string, threadId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id !== chatId) return chat

        return {
          ...chat,
          threads: chat.threads.map((thread) =>
            thread.id === threadId ? { ...thread, isCollapsed: !thread.isCollapsed } : thread,
          ),
        }
      }),
    )
  }, [])

  const markAsRead = useCallback((chatId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              unreadCount: 0,
              threads: chat.threads.map((thread) => ({
                ...thread,
                messages: thread.messages.map((msg) => ({ ...msg, isRead: true })),
              })),
            }
          : chat,
      ),
    )
  }, [])

  const getOtherUser = useCallback(
    (chatId: string) => {
      if (!user) return null

      const chat = chats.find((c) => c.id === chatId)
      if (!chat) return null

      const otherUserId = chat.participants.find((id) => id !== user.id)
      if (!otherUserId) return null

      const otherUserData = Object.values(DUMMY_USERS).find((u) => u.id === otherUserId)
      if (!otherUserData) return null

      return {
        id: otherUserData.id,
        name: otherUserData.name,
        phone: otherUserData.phone,
      }
    },
    [user, chats],
  )

  const updateChatPermissions = useCallback(
    (chatId: string, userId: string, permissions: Partial<Chat["mediaPermissions"][string]>) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                mediaPermissions: {
                  ...chat.mediaPermissions,
                  [userId]: {
                    ...chat.mediaPermissions[userId],
                    ...permissions,
                  },
                },
              }
            : chat,
        ),
      )
    },
    [],
  )

  const getChatPermissions = useCallback(
    (chatId: string, userId: string) => {
      const chat = chats.find((c) => c.id === chatId)
      return chat?.mediaPermissions[userId] || null
    },
    [chats],
  )

  const getChat = useCallback(
    (chatId: string) => {
      return chats.find((c) => c.id === chatId) || null
    },
    [chats],
  )

  const getThread = useCallback(
    (chatId: string, threadId: string) => {
      const chat = chats.find((c) => c.id === chatId)
      if (!chat) return null
      return chat.threads.find((t) => t.id === threadId) || null
    },
    [chats],
  )

  const getUserChats = useCallback(() => {
    if (!user) return []

    return chats
      .filter((chat) => chat.participants.includes(user.id))
      .map((chat) => ({
        ...chat,
        threads: chat.threads.filter((thread) => !thread.isDraft || thread.createdBy === user.id),
      }))
      .filter((chat) => chat.threads.length > 0)
  }, [user, chats])

  return (
    <ChatContext.Provider
      value={{
        chats,
        sendMessage,
        createChat,
        createThread,
        markAsRead,
        toggleThreadCollapse,
        getOtherUser,
        updateChatPermissions,
        getChatPermissions,
        getChat,
        getThread,
        getUserChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
