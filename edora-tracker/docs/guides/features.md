# Features

> Complete feature breakdown by user role.

---

## Table of Contents

- [Platform Overview](#platform-overview)
- [Student Features](#student-features)
- [Mentor Features](#mentor-features)
- [Professional Features](#professional-features)
- [Recruiter Features](#recruiter-features)
- [Admin Features](#admin-features)
- [Shared Features](#shared-features)

---

## Platform Overview

Edora is built around **five user roles**, each with a dedicated dashboard, onboarding flow, and feature set. The platform connects learners with mentors and recruiters in a unified ecosystem.

```
                    ┌─────────┐
                    │  Admin  │ ◄── Verifies all roles
                    └────┬────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐    ┌─────▼─────┐   ┌─────▼──────┐
    │ Student │◄──►│  Mentor   │   │ Recruiter  │
    └────┬────┘    └─────┬─────┘   └─────┬──────┘
         │               │               │
         │          ┌────▼─────┐          │
         └─────────►│Profession│◄─────────┘
                    │   al     │
                    └──────────┘
```

---

## Student Features

**Dashboard**: `/dashboard/students/`

### Home

- Personalized dashboard overview
- Quick actions and activity summary
- Recent roadmap progress

### AI Roadmaps (`/roadmap`)

- **Edora AI**-generated learning roadmaps
- Milestone-based progress tracking
- Topic-by-topic breakdowns with estimated timelines
- Visual progress indicators

### Workspace (`/workspace`)

- **Tiptap-powered** rich text editor
- Folder and file management
- Document templates for notes, plans, and reports
- Collaborative editing support (Yjs)

### Calendar (`/calendar`)

- View upcoming events and deadlines
- Interview schedule tracking
- Mentor session calendar

### Career (`/career`)

- Browse job opportunities posted by recruiters
- Apply to jobs directly
- Track application status: `applied → scheduled → selected → hired`
- View interview details and reschedule history

### Explore (`/explore`)

- Discover mentors and professionals
- Browse learning content and resources
- Search and filter by skills, industry, and expertise

### Analytics (`/analytics`)

- Learning progress charts (Recharts)
- Milestone completion rates
- Study habit tracking
- Activity heatmaps

### Edora AI (`/edora-ai`)

- AI-powered chat assistant
- Get roadmap suggestions
- Ask questions about career paths
- Study planning assistance

### Classroom (`/classroom`)

- Join mentor-led classrooms
- Access shared materials
- Collaborative learning spaces

### Mentors (`/mentors`)

- View connected mentors
- Request mentorship sessions
- Mentor activity feed

### inbox (`/inbox`)

- Direct messaging with mentors and peers
- Real-time chat interface

### Settings (`/settings`)

- Profile management
- Privacy controls
- Notification preferences
- Account settings

### Onboarding (`/onboarding`)

- Multi-step onboarding wizard capturing:
  - **Self-Discovery**: favorite subjects, learning preferences, hobbies
  - **Strengths & Weaknesses**: skills, communication style, thinking style
  - **Career Awareness**: known careers, professional connections
  - **Career Interest**: dream job, field of interest, work preferences
  - **Academic Status**: grades, certifications, courses
  - **Technical Skills**: programming, tools, portfolio, GitHub
  - **Study Habits**: daily hours, schedule, distractions
  - **Dreams & Vision**: life outlook, career priorities
  - **Mindset**: learning attitude, failure handling

---

## Mentor Features

**Dashboard**: `/dashboard/mentor/`

### Home

- Mentee activity overview
- Upcoming sessions
- Pending requests

### Classroom (`/classroom`)

- Create and manage classrooms
- Share learning materials
- Track student participation

### Career (`/career`)

- Career guidance tools
- Industry insights

### Roadmap (`/roadmap`)

- Review and validate mentee roadmaps
- Suggest modifications
- Track mentee progress

### Analytics (`/analytics`)

- Mentee progress dashboards
- Session statistics
- Rating and review summaries

### Resources (`/resources`)

- Content management
- Upload and organize learning materials
- Share with mentees

### Explore (`/explore`)

- Discover other mentors and professionals
- Network within the platform

### Messages (`/messages`)

- Chat with mentees and peers
- Session coordination

### Edora AI (`/edora-ai`)

- AI assistant for mentoring strategies
- Generate lesson plans
- Get insights about mentee progress

### Workspace (`/workspace`)

- Personal note-taking
- Document creation with Tiptap editor

### Schedule (`/schedule`)

- Manage availability
- View upcoming sessions
- Session booking management

### Settings (`/settings`)

- Profile management
- Mentorship preferences (max mentees, hourly rate, availability)
- Verification status

### Onboarding

- Professional background
- Education & certifications
- Expertise & skills
- Mentorship preferences and availability
- Motivation and teaching approach
- Profile links (LinkedIn, GitHub, website)

### Verification

- Submit for admin verification
- Track verification status
- Pending approval page (`/mentor-pending`)

---

## Professional Features

**Dashboard**: `/dashboard/professionals/`

### Home

- Activity overview
- Career progress summary

### Roadmap (`/roadmap`)

- AI-powered career development roadmaps
- Skill gap analysis

### Analytics (`/analytics`)

- Learning progress tracking
- Career growth metrics

### Classroom (`/classroom`)

- Join learning groups
- Peer collaboration

### Career (`/career`)

- Job opportunities
- Career exploration tools

### Explore (`/explore`)

- Discover mentors and peers
- Networking

### Edora AI (`/edora-ai`)

- Career coaching AI
- Skill recommendations

### Workspace (`/workspace`)

- Document management
- Rich-text editing

### Calendar (`/calendar`)

- Schedule management
- Event tracking

### inbox (`/inbox`)

- Direct messaging

### Settings (`/settings`)

- Profile management
- Privacy settings
- Account preferences

### Onboarding

- Professional background & experience
- Education & certifications
- Technical skills & expertise
- Career goals & motivations
- Profile links

### Verification

- Submit for admin verification
- Pending approval page (`/professional-pending`)

---

## Recruiter Features

**Dashboard**: `/dashboard/recruiter/`

### Job Posting (`/post-job`)

- Create detailed job opportunities with:
  - Title, description, responsibilities, benefits
  - Required & nice-to-have skills
  - Experience range, education requirements
  - Salary range with currency
  - Job type (full-time, part-time, contract, internship, freelance)
  - Work mode (remote, hybrid, on-site)
  - Application deadline

### Candidate Management

- View applicants per job
- Accept/reject candidates
- Track application pipeline: `applied → scheduled → selected → hired`

### Interview Scheduling (`/scheduled-interviews`)

- **Google Calendar integration** — auto-creates events with Google Meet links
- Email inbox with `.ics` calendar attachments
- Reschedule with full history tracking
- Automated reminder emails (24h before)

### Organization Verification

- Register organization with company details & logo
- Admin-verified organization badges

---

## Admin Features

**Dashboard**: `/dashboard/admin/`

### User Management (`/users`)

- View all platform users
- Filter by role
- View profiles and activity

### Verification

- Approve/reject mentor applications
- Approve/reject professional applications
- Verify recruiter organizations

### Settings (`/settings`)

- Platform configuration
- System settings

### Logs (`/logs`)

- Activity logs
- Audit trail

---

## Shared Features

### Authentication

- **Email OTP** login (no passwords)
- Role-based access control
- Session management (15-day expiry)
- Secure OTP with expiration

### Rich Text Editor

- **Tiptap 3** with 20+ extensions:
  - Code blocks with Shiki syntax highlighting
  - Tables, images, horizontal rules
  - Task lists, links, mentions, emoji
  - Mathematics (KaTeX)
  - Drag handles, bubble menus
  - Collaborative editing (Yjs)
  - Text alignment, typography, colors

### Theming

- Dark / Light / System theme toggle
- Consistent design tokens via CSS variables

### Animations

- GSAP scroll-triggered animations (landing page)
- Motion layout animations (dashboard transitions)
- Click spark effects
- Animated noise overlays

### Data Tables

- TanStack Table with sorting, filtering, pagination
- Server-side data fetching
