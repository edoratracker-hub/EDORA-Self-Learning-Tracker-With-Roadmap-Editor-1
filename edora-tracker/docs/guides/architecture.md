# Architecture

> System design, conventions, and data flow for the Edora platform.

---

## Table of Contents

- [Overview](#overview)
- [Application Layers](#application-layers)
- [Routing Model](#routing-model)
- [Data Flow](#data-flow)
- [Provider Hierarchy](#provider-hierarchy)
- [Naming Conventions](#naming-conventions)
- [Key Design Decisions](#key-design-decisions)

---

## Overview

Edora follows a **domain-driven** architecture built on Next.js 16 App Router. The codebase is organized by user role — each role (student, mentor, professional, recruiter, admin) has its own dashboard subtree, server actions, and schemas.

```
┌──────────────────────────────────────────────────────┐
│                     Client (Browser)                 │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐            │
│  │ React UI │ │ Tiptap   │ │ TanStack  │            │
│  │ (Radix)  │ │ Editor   │ │ Query     │            │
│  └────┬─────┘ └────┬─────┘ └─────┬─────┘            │
│       │             │             │                  │
│  ┌────▼─────────────▼─────────────▼─────┐            │
│  │          React Contexts              │            │
│  │  (User, AI, Collab, App)             │            │
│  └────────────────┬─────────────────────┘            │
└───────────────────┼──────────────────────────────────┘
                    │ Server Actions / API Routes
┌───────────────────▼──────────────────────────────────┐
│                   Next.js Server                     │
│  ┌──────────┐ ┌──────────┐ ┌───────────────┐        │
│  │ Server   │ │ API      │ │ Auth          │        │
│  │ Actions  │ │ Routes   │ │ (Better Auth) │        │
│  └────┬─────┘ └────┬─────┘ └───────┬───────┘        │
│       │             │               │                │
│  ┌────▼─────────────▼───────────────▼─────┐          │
│  │           Drizzle ORM                  │          │
│  │  (Schema → Query Builder → SQL)        │          │
│  └────────────────┬───────────────────────┘          │
└───────────────────┼──────────────────────────────────┘
                    │
┌───────────────────▼──────────────────────────────────┐
│        PostgreSQL (Neon Serverless)                   │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│  │  Auth  │ │Student │ │Mentor  │ │Recruiter│       │
│  │ Tables │ │Profile │ │Profile │ │ + Jobs  │       │
│  └────────┘ └────────┘ └────────┘ └────────┘        │
└──────────────────────────────────────────────────────┘
```

---

## Application Layers

### 1. Presentation Layer (`src/components/`, `src/app/*/_components/`)

- **Shared components** in `src/components/ui/` — Radix primitives styled with Tailwind (shadcn/ui pattern)
- **Page-specific components** co-located in `_components/` directories next to their route
- **Animations** via GSAP (scroll-triggered), Motion (layout), and React Three Fiber (3D)

### 2. State & Context Layer (`src/contexts/`)

| Context         | Purpose                                   |
| --------------- | ----------------------------------------- |
| `UserContext`   | Current authenticated user, role, session |
| `AiContext`     | Tiptap AI token and feature flags         |
| `CollabContext` | Yjs collaborative editing state           |
| `AppContext`    | Global app state, sidebar, preferences    |

### 3. Data Layer (`src/app/actions/`)

Server Actions organized by domain:

| File                              | Domain                                |
| --------------------------------- | ------------------------------------- |
| `student-actions.ts`              | Student dashboard operations          |
| `student-profile-actions.ts`      | Student onboarding & profile          |
| `student-career-actions.ts`       | Career exploration & job applications |
| `mentor-profile-actions.ts`       | Mentor onboarding & profile           |
| `professional-profile-actions.ts` | Professional onboarding & profile     |
| `recruiter-actions.ts`            | Job posting & candidate management    |
| `interview-actions.ts`            | Interview scheduling & rescheduling   |
| `chat-actions.ts`                 | Messaging between users               |
| `workspace-actions.ts`            | Workspace, folder & file CRUD         |
| `admin-actions.ts`                | User verification & admin operations  |
| `session.ts`                      | Session management helpers            |

### 4. Database Layer (`src/drizzle/`)

- **Connection**: Neon Serverless adapter (`db.ts`)
- **Schema**: Domain-split files in `database/` — each role has its own schema file
- **Migrations**: Auto-generated by Drizzle Kit in `migrations/`

---

## Routing Model

Edora uses Next.js App Router with the following conventions:

```
src/app/
├── (root)/                    # Route group — no layout prefix
│   ├── sign-in/               # /sign-in
│   ├── sign-up/               # /sign-up
│   ├── verify-otp/            # /verify-otp
│   └── choose-role/           # /choose-role
├── dashboard/
│   ├── students/              # /dashboard/students/*
│   │   ├── layout.tsx         # Student dashboard shell
│   │   ├── page.tsx           # Redirect → /home
│   │   ├── home/              # Dashboard home
│   │   ├── roadmap/           # AI roadmaps
│   │   ├── workspace/         # Tiptap editor workspace
│   │   ├── calendar/          # Schedule & events
│   │   ├── career/            # Career exploration
│   │   ├── explore/           # Discover mentors & content
│   │   ├── analytics/         # Progress analytics
│   │   ├── edora-ai/          # AI chat assistant
│   │   ├── classroom/         # Mentor classrooms
│   │   ├── mentors/           # Connected mentors
│   │   ├── mentees/           # Peer mentoring
│   │   ├── inbox/             # Messages
│   │   ├── settings/          # Account settings
│   │   ├── help/              # Help & support
│   │   └── onboarding/        # Onboarding wizard
│   ├── mentor/                # /dashboard/mentor/*
│   ├── professionals/         # /dashboard/professionals/*
│   ├── recruiter/             # /dashboard/recruiter/*
│   └── admin/                 # /dashboard/admin/*
├── mentor-onboarding/         # Standalone onboarding page
├── professional-onboarding/   # Standalone onboarding page
└── api/                       # API route handlers
    ├── auth/                  # Better Auth endpoints
    ├── jobs/                  # Job-related APIs
    ├── recruiters/            # Recruiter APIs
    ├── verify-mentor/         # Mentor verification
    ├── verify-organization/   # Org verification
    ├── verify-professional/   # Professional verification
    └── verify-user/           # User verification
```

### Convention: `_components/`

Directories prefixed with `_` are Next.js private folders — they won't become routes. Every dashboard page co-locates its components in a sibling `_components/` directory.

---

## Data Flow

### Server Action Pattern

```
User Interaction
      │
      ▼
Client Component (calls server action)
      │
      ▼
Server Action (src/app/actions/*.ts)
      │  - Validates input (Zod)
      │  - Checks session/auth
      │  - Executes DB queries (Drizzle)
      │  - Returns typed response
      ▼
Client Component (updates UI via TanStack Query)
```

### Auth Flow

```
Email Input → Send OTP → Verify OTP → Session Created
                                           │
                                    Role assigned?
                                    ├── Yes → Dashboard
                                    └── No  → Choose Role → Onboarding → Dashboard
```

---

## Provider Hierarchy

```tsx
<ThemeProvider>
  {" "}
  // Dark/light/system theme
  <TanStackQueryProvider>
    {" "}
    // Server state management
    <UserContext>
      {" "}
      // Auth & role
      <AiContext>
        {" "}
        // AI features
        <CollabContext>
          {" "}
          // Yjs collaboration
          <AppContext>
            {" "}
            // App-level state
            {children}
          </AppContext>
        </CollabContext>
      </AiContext>
    </UserContext>
  </TanStackQueryProvider>
</ThemeProvider>
```

---

## Naming Conventions

| Entity          | Convention               | Example                  |
| --------------- | ------------------------ | ------------------------ |
| Route folders   | `kebab-case`             | `edora-ai/`, `post-job/` |
| Components      | `PascalCase`             | `ChatInterface.tsx`      |
| Component files | `kebab-case`             | `chat-interface.tsx`     |
| Server actions  | `camelCase` functions    | `getStudentProfile()`    |
| DB schemas      | `camelCase` table vars   | `studentProfile`         |
| DB table names  | `snake_case`             | `student_profile`        |
| Hooks           | `use-kebab-case`         | `use-mobile.ts`          |
| Contexts        | `PascalCase` + `Context` | `UserContext`            |

---

## Key Design Decisions

| Decision                           | Rationale                                                                              |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| **Domain-split schemas**           | Each role's tables in separate files keeps schemas focused and reduces merge conflicts |
| **Server Actions over API routes** | Type-safe end-to-end, no serialization overhead, automatic bundling                    |
| **Neon Serverless**                | Zero cold-start with HTTP-based connections, ideal for edge/serverless                 |
| **Better Auth**                    | Lightweight auth with built-in OTP plugin, no external dependency (Clerk, Auth0)       |
| **Tiptap 3 with Yjs**              | Rich-text editing with real-time collaboration built into workspace                    |
| **Co-located `_components/`**      | Keep page-specific UI close to the route, easy to find and refactor                    |
| **GSAP for landing page**          | Scroll-driven animations with precise timeline control                                 |
| **shadcn/ui pattern**              | Components copied into repo (not npm) — full control over styling and behavior         |
