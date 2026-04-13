<p align="center">
  <img src="../public/icon.svg" alt="Edora Logo" width="64" height="64" />
</p>

<h1 align="center">EDORA</h1>

<p align="center">
  <strong>AI-Powered Self-Learning Tracker</strong><br/>
  Design clear learning roadmaps. Stay consistent. Grow with measurable outcomes.
</p>

<p align="center">
  <a href="#getting-started">Getting Started</a> &middot;
  <a href="./guides/architecture.md">Architecture</a> &middot;
  <a href="./guides/features.md">Features</a> &middot;
  <a href="./guides/edora-ai.md">Edora AI</a> &middot;
  <a href="./guides/database.md">Database</a> &middot;
  <a href="./guides/api-reference.md">API Reference</a> &middot;
  <a href="./guides/deployment.md">Deployment</a>
</p>

---

## What is Edora?

**Edora** is a full-stack learning management platform that helps **students**, **mentors**, **professionals**, and **recruiters** collaborate on structured learning journeys — powered by AI and guided by humans.

| Role              | What they do                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| **Students**      | Build AI-generated roadmaps, track milestones, earn badges & certificates, connect with mentors |
| **Mentors**       | Guide mentees through classrooms, validate progress, manage schedules and resources             |
| **Professionals** | Continue learning alongside career growth, explore opportunities, collaborate in workspaces     |
| **Recruiters**    | Post job opportunities, schedule interviews with Google Calendar & Meet, track candidates       |
| **Admin**         | Verify users & organizations, manage platform settings, review activity logs                    |

---

## Getting Started

### Prerequisites

| Tool                                      | Version                                        |
| ----------------------------------------- | ---------------------------------------------- |
| [Node.js](https://nodejs.org)             | v20+ (LTS recommended)                         |
| [pnpm](https://pnpm.io)                   | v9+                                            |
| [PostgreSQL](https://www.postgresql.org/) | v15+ (or [Neon](https://neon.tech) serverless) |

### 1. Clone & Install

```bash
git clone https://github.com/your-org/edora-tracker.git
cd edora-tracker
pnpm install
```

### 2. Configure Environment

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

**Required variables:**

```env
# Database (Neon / PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/edora

# Auth
BETTER_AUTH_SECRET=your_random_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Calendar & Meet (for recruiter interviews)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Email (OTP verification & interview inbox)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Tiptap (collaborative editor & AI)
TIPTAP_COLLAB_SECRET=your_tiptap_secret
```

### 3. Set Up the Database

```bash
# Generate migration files from the schema
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Or push schema directly (development)
pnpm db:push
```

### 4. Run the Dev Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

### 5. Explore the Dashboard

After signing up and completing onboarding, you'll be taken to your role-specific dashboard:

| Role         | Dashboard URL                   |
| ------------ | ------------------------------- |
| Student      | `/dashboard/students/home`      |
| Mentor       | `/dashboard/mentor/home`        |
| Professional | `/dashboard/professionals/home` |
| Recruiter    | `/dashboard/recruiter`          |
| Admin        | `/dashboard/admin`              |

---

## Project Structure

```
edora-tracker/
├── public/                          # Static assets & icons
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout (fonts, theme, providers)
│   │   ├── page.tsx                 # Landing page
│   │   ├── _components/             # Landing page components
│   │   ├── (root)/                  # Auth routes (sign-in, sign-up, verify-otp)
│   │   ├── actions/                 # Server actions (business logic)
│   │   ├── api/                     # API routes (auth, jobs, verification)
│   │   ├── dashboard/               # Role-based dashboards
│   │   │   ├── students/            # Student dashboard
│   │   │   ├── mentor/              # Mentor dashboard
│   │   │   ├── professionals/       # Professional dashboard
│   │   │   ├── recruiter/           # Recruiter dashboard
│   │   │   └── admin/               # Admin panel
│   │   ├── hooks/                   # App-level custom hooks
│   │   ├── lib/                     # Auth, email, calendar, utils
│   │   ├── mentor-onboarding/       # Mentor onboarding flow
│   │   ├── professional-onboarding/ # Professional onboarding flow
│   │   └── providers/               # React context providers
│   ├── components/                  # Shared UI components
│   │   ├── ui/                      # Radix-based primitives (shadcn/ui)
│   │   ├── chat/                    # Chat UI components
│   │   ├── tiptap-*/                # Tiptap editor components & extensions
│   │   └── animations/              # GSAP & Motion animations
│   ├── contexts/                    # React contexts (AI, App, Collab, User)
│   ├── drizzle/                     # Database layer
│   │   ├── db.ts                    # Database connection (Neon serverless)
│   │   ├── schema.ts                # Schema barrel export
│   │   ├── database/                # Table schemas (per-domain)
│   │   └── migrations/              # Drizzle migration files
│   ├── hooks/                       # Shared custom hooks
│   ├── lib/                         # Utilities, paths, types
│   └── styles/                      # SCSS variables & keyframes
├── drizzle.config.ts                # Drizzle Kit configuration
├── next.config.ts                   # Next.js configuration
├── package.json
└── tsconfig.json
```

---

## Tech Stack

| Layer             | Technology                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| **Framework**     | [Next.js 16](https://nextjs.org) (App Router)                                                       |
| **Language**      | [TypeScript 5.9](https://www.typescriptlang.org)                                                    |
| **UI**            | [React 19](https://react.dev), [Radix UI](https://radix-ui.com), [shadcn/ui](https://ui.shadcn.com) |
| **Styling**       | [Tailwind CSS 4](https://tailwindcss.com), SCSS                                                     |
| **Animation**     | [GSAP](https://gsap.com), [Motion](https://motion.dev), [Three.js](https://threejs.org) (via R3F)   |
| **Editor**        | [Tiptap 3](https://tiptap.dev) with collaborative editing (Yjs)                                     |
| **Database**      | [PostgreSQL](https://postgresql.org) via [Neon Serverless](https://neon.tech)                       |
| **ORM**           | [Drizzle ORM](https://orm.drizzle.team)                                                             |
| **Auth**          | [Better Auth](https://www.better-auth.com) with email OTP                                           |
| **Data Fetching** | [TanStack Query](https://tanstack.com/query)                                                        |
| **Forms**         | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)                             |
| **Tables**        | [TanStack Table](https://tanstack.com/table)                                                        |
| **Email**         | [Nodemailer](https://nodemailer.com) with HTML templates                                            |
| **Calendar**      | [Google Calendar API](https://developers.google.com/calendar) with Meet links                       |
| **Charts**        | [Recharts](https://recharts.org)                                                                    |
| **Drag & Drop**   | [@dnd-kit](https://dndkit.com)                                                                      |

---

## Documentation

| Guide                                        | Description                                      |
| -------------------------------------------- | ------------------------------------------------ |
| [Architecture](./guides/architecture.md)     | System design, folder conventions, data flow     |
| [Features](./guides/features.md)             | Complete feature breakdown by role               |
| [Edora AI](./guides/edora-ai.md)             | AI assistant integration & capabilities          |
| [Database](./guides/database.md)             | Schema reference, tables, relations              |
| [API Reference](./guides/api-reference.md)   | Server actions & API routes                      |
| [Authentication](./guides/authentication.md) | Auth flow, sessions, OTP verification            |
| [Workspace & Editor](./guides/workspace.md)  | Tiptap editor, collaborative editing, templates  |
| [Interview System](./guides/interviews.md)   | Scheduling, Google Calendar, email inbox |
| [Deployment](./guides/deployment.md)         | Production checklist & Vercel deployment         |
| [Contributing](./guides/contributing.md)     | Code style, PR process, conventions              |

---

## Scripts

| Command            | Description                      |
| ------------------ | -------------------------------- |
| `pnpm dev`         | Start development server         |
| `pnpm build`       | Production build                 |
| `pnpm start`       | Start production server          |
| `pnpm lint`        | Run ESLint                       |
| `pnpm db:generate` | Generate Drizzle migrations      |
| `pnpm db:migrate`  | Run migrations                   |
| `pnpm db:push`     | Push schema to database          |
| `pnpm db:studio`   | Open Drizzle Studio (DB browser) |

---

## License

This project is proprietary. All rights reserved.

---

<p align="center">
  <sub>Built with purpose by the Edora team &middot; 2026</sub>
</p>
