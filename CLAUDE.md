# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Whisperoni is a Next.js-based dating/social platform focused on meaningful connections through posts and private messaging. The app emphasizes privacy (no public comments/likes) and uses a sophisticated "whisper" metaphor for private conversations.

## Development Commands

```bash
# Development
pnpm dev          # Start dev server (default: http://localhost:3000)

# Build & Production
pnpm build        # Create production build
pnpm start        # Start production server

# Linting
pnpm lint         # Run Next.js linter (currently ignores errors during builds)
```

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode enabled, but build errors ignored in config)
- **UI**: React 19, Radix UI primitives, Tailwind CSS 4, shadcn/ui components
- **State**: React Context (no external state management)
- **Package Manager**: pnpm

## Architecture

### Context Providers (lib/)

The app uses a nested context provider architecture defined in `app/layout.tsx`:

```
AuthProvider
└── PostsProvider
    └── ChatProvider
        └── ModerationProvider
```

**AuthProvider** (`lib/auth-context.tsx`)
- Manages user authentication and profile data
- Uses localStorage for session persistence (MVP implementation)
- Provides dummy users and verification codes for testing
- Phone numbers: +1234567890 through +1234567899 (all use code: 123456)
- User ID "3" has admin privileges
- User ID "9" is quarantined by default

**PostsProvider** (`lib/posts-context.tsx`)
- Manages posts feed and filtering
- Filters by gender, orientation, and location
- Hides posts from quarantined users (`isVisible: false`)
- Posts are user-generated content shared publicly

**ChatProvider** (`lib/chat-context.tsx`)
- Manages 1-on-1 conversations organized by threads
- Each chat can have multiple threads, each referencing a specific post
- Threads start as "drafts" until first message is sent
- Media permissions are per-user within each chat
- Draft threads are only visible to their creator

**ModerationProvider** (`lib/moderation-context.tsx`)
- Handles user reporting and quarantine system
- Quarantined users' posts become invisible
- Admins can review reports and take action

### Routing Structure

- `/` - Landing page (redirects authenticated users to /feed)
- `/auth` - Phone authentication with verification codes
- `/feed` - Main posts feed with filtering
- `/profile` - User profile settings and account management
- `/chats` - List of all user conversations
- `/chat/[userId]` - Individual chat view with thread system
- `/admin-chat` - Admin moderation interface
- `/architecture` - Architecture documentation page

### Key Features

**Thread-Based Messaging**
- Multiple conversation threads per chat
- Each thread references a specific post (context for conversation)
- Threads can be collapsed/expanded
- Draft threads hidden from other user until first message

**Media Permissions**
- Per-user settings for audio/video messages and calls
- Configurable within each chat
- Defaults to all permissions disabled in new chats

**Moderation System**
- User reporting with reason
- Quarantine system (hides user's posts, restricts media)
- Admin panel for reviewing reports

### Configuration Notes

- ESLint and TypeScript errors are ignored during builds (`next.config.mjs`)
- Images are unoptimized (suitable for static export)
- Path alias: `@/*` maps to project root
- Middleware is placeholder only (no real JWT verification in MVP)

### Styling

- Uses Tailwind CSS 4 with custom font variables
- Two font families: Inter (sans) and Playfair Display (serif)
- shadcn/ui components in `components/ui/`
- Custom components in `components/`

### MVP Considerations

This is an MVP with dummy data and client-side only logic:
- No real backend API calls
- Authentication uses localStorage
- All data stored in React Context
- Verification codes hardcoded
- No real-time updates or WebSocket connections
