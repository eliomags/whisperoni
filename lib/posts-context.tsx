"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { useAuth } from "./auth-context"

export type Post = {
  id: string
  userId: string
  userName: string
  userGender: "male" | "female" | "other"
  userOrientation: "straight" | "gay" | "bisexual" | "other"
  location: string
  content: string
  createdAt: Date
  isVisible: boolean
}

type PostsContextType = {
  posts: Post[]
  createPost: (content: string) => void
  filteredPosts: Post[]
  filters: PostFilters
  setFilters: (filters: PostFilters) => void
  getPost: (postId: string) => Post | null
  showFilters: boolean
  setShowFilters: (show: boolean) => void
}

export type PostFilters = {
  gender?: "male" | "female" | "other" | "all"
  orientation?: "straight" | "gay" | "bisexual" | "other" | "all"
  location?: string
}

const PostsContext = createContext<PostsContextType | undefined>(undefined)

// Dummy posts for MVP
const DUMMY_POSTS: Post[] = [
  {
    id: "1",
    userId: "1",
    userName: "Alex Johnson",
    userGender: "male",
    userOrientation: "straight",
    location: "New York, NY",
    content: "Love exploring new coffee shops in the city. Anyone know a good spot in Brooklyn?",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isVisible: true,
  },
  {
    id: "2",
    userId: "2",
    userName: "Sarah Miller",
    userGender: "female",
    userOrientation: "straight",
    location: "Los Angeles, CA",
    content: "Just finished a great hike at Runyon Canyon. The sunset views were incredible!",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isVisible: true,
  },
  {
    id: "3",
    userId: "1",
    userName: "Alex Johnson",
    userGender: "male",
    userOrientation: "straight",
    location: "New York, NY",
    content: "Looking for someone to check out the new art exhibit at MoMA this weekend.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isVisible: true,
  },
  {
    id: "4",
    userId: "2",
    userName: "Sarah Miller",
    userGender: "female",
    userOrientation: "straight",
    location: "Los Angeles, CA",
    content: "Trying to find the best tacos in LA. Any recommendations?",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isVisible: true,
  },
  {
    id: "5",
    userId: "4",
    userName: "Marcus Chen",
    userGender: "male",
    userOrientation: "gay",
    location: "San Francisco, CA",
    content: "Tech meetup tonight in SoMa! Who's interested in discussing the latest in AI?",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    isVisible: true,
  },
  {
    id: "6",
    userId: "5",
    userName: "Emma Rodriguez",
    userGender: "female",
    userOrientation: "bisexual",
    location: "Miami, FL",
    content: "Beach volleyball anyone? Looking for people to join our Sunday games at South Beach.",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isVisible: true,
  },
  {
    id: "7",
    userId: "6",
    userName: "Jordan Taylor",
    userGender: "other",
    userOrientation: "other",
    location: "Austin, TX",
    content: "Live music scene here is amazing! Catching a show at Stubb's tonight. Anyone want to join?",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    isVisible: true,
  },
  {
    id: "8",
    userId: "7",
    userName: "David Kim",
    userGender: "male",
    userOrientation: "straight",
    location: "Seattle, WA",
    content: "Coffee snob looking for the perfect espresso. Pike Place has some hidden gems!",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    isVisible: true,
  },
  {
    id: "9",
    userId: "8",
    userName: "Lisa Anderson",
    userGender: "female",
    userOrientation: "gay",
    location: "Portland, OR",
    content: "Farmers market Saturdays are my favorite. Who else loves fresh produce and local crafts?",
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    isVisible: true,
  },
  {
    id: "10",
    userId: "9",
    userName: "Quarantined User",
    userGender: "male",
    userOrientation: "straight",
    location: "Chicago, IL",
    content: "This post should not be visible because the user is quarantined.",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    isVisible: false,
  },
  {
    id: "11",
    userId: "10",
    userName: "Rachel Green",
    userGender: "female",
    userOrientation: "straight",
    location: "Boston, MA",
    content: "Fall foliage season is here! Planning a road trip through New England. Route suggestions?",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    isVisible: true,
  },
  {
    id: "12",
    userId: "4",
    userName: "Marcus Chen",
    userGender: "male",
    userOrientation: "gay",
    location: "San Francisco, CA",
    content: "Just discovered this amazing ramen spot in Japantown. The tonkotsu is perfection!",
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    isVisible: true,
  },
  {
    id: "13",
    userId: "7",
    userName: "David Kim",
    userGender: "male",
    userOrientation: "straight",
    location: "Seattle, WA",
    content: "Hiking the Cascades this weekend. Anyone want to join for a day trip?",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    isVisible: true,
  },
]

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(DUMMY_POSTS)
  const [filters, setFilters] = useState<PostFilters>({
    gender: "all",
    orientation: "all",
    location: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const { user } = useAuth()

  const createPost = (content: string) => {
    if (!user) return

    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userGender: user.gender,
      userOrientation: user.orientation,
      location: user.location,
      content,
      createdAt: new Date(),
      isVisible: !user.isQuarantined,
    }

    setPosts([newPost, ...posts])
  }

  const filteredPosts = posts.filter((post) => {
    if (!post.isVisible) return false

    if (filters.gender && filters.gender !== "all" && post.userGender !== filters.gender) {
      return false
    }

    if (filters.orientation && filters.orientation !== "all" && post.userOrientation !== filters.orientation) {
      return false
    }

    if (filters.location && !post.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false
    }

    return true
  })

  const getPost = useCallback(
    (postId: string) => {
      return posts.find((p) => p.id === postId) || null
    },
    [posts],
  )

  return (
    <PostsContext.Provider
      value={{ posts, createPost, filteredPosts, filters, setFilters, getPost, showFilters, setShowFilters }}
    >
      {children}
    </PostsContext.Provider>
  )
}

export function usePosts() {
  const context = useContext(PostsContext)
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostsProvider")
  }
  return context
}
