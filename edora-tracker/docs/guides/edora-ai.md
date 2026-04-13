# Edora AI

> AI-powered assistant integrated across the Edora platform.

---

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Student AI Features](#student-ai-features)
- [Mentor AI Features](#mentor-ai-features)
- [Professional AI Features](#professional-ai-features)
- [AI in the Editor](#ai-in-the-editor)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Connecting with Edora AI](#connecting-with-edora-ai)

---

## Overview

**Edora AI** is the platform's intelligent assistant that helps users at every stage of their learning journey. It appears in two forms:

1. **Chat Interface** — A dedicated AI chat page (`/edora-ai`) available to students, mentors, and professionals
2. **Editor AI** — AI capabilities embedded directly in the Tiptap rich-text editor for content generation

---

## How It Works

Edora AI uses the **Tiptap AI extension** backed by a cloud AI token system. The AI context is managed through the `AiContext` React provider.

```
User Message
     │
     ▼
ChatInterface Component
     │
     ▼
AiContext (manages tokens)
     │
     ▼
Tiptap AI API (cloud)
     │
     ▼
AI Response → Rendered in chat / editor
```

### Token Management

The `AiContext` (`src/contexts/ai-context.tsx`) handles:

- Fetching AI tokens from the Tiptap cloud
- Feature flag control (AI can be disabled via URL param `?noAi=1`)
- Token refresh lifecycle

```tsx
// src/contexts/ai-context.tsx
const { aiToken, hasAi } = useAi();

// aiToken  — JWT for authenticating with the AI service
// hasAi    — boolean indicating if AI features are enabled
```

---

## Student AI Features

**Route**: `/dashboard/students/edora-ai`

### AI Chat Assistant

- Conversational interface for learning guidance
- Ask about career paths, study strategies, and skill development
- Get personalized roadmap suggestions based on profile data

### Roadmap Generation

- AI analyzes the student's onboarding profile:
  - Self-discovery data (interests, preferences, hobbies)
  - Career interests (dream job, field of interest)
  - Current skills (programming, tools, certifications)
  - Academic status (grades, exams, courses)
- Generates a structured learning roadmap with milestones

### Study Planning

- Break down large goals into actionable daily/weekly tasks
- Suggest optimal study schedules based on habits
- Recommend resources and learning materials

### Career Guidance

- Explore career paths aligned with interests and skills
- Understand skill gaps and how to address them
- Get industry insights and job market trends

---

## Mentor AI Features

**Route**: `/dashboard/mentor/edora-ai`

### Mentoring Assistance

- Generate lesson plans and teaching strategies
- Get insights about mentee progress and areas needing attention
- Suggest exercises and assignments

### Content Generation

- Draft classroom materials
- Create assessment templates
- Generate feedback for mentees

---

## Professional AI Features

**Route**: `/dashboard/professionals/edora-ai`

### Career Coaching

- Skill gap analysis based on career goals
- Resume and portfolio improvement suggestions
- Industry trend briefings

### Learning Recommendations

- Suggest courses, certifications, and projects
- Create personalized upskilling roadmaps

---

## AI in the Editor

The Tiptap editor integrates AI capabilities for content creation:

### AI Writing Assistance

- **Auto-complete** — Suggest the next sentence or paragraph
- **Rewrite** — Rephrase selected text for clarity or tone
- **Expand** — Elaborate on a brief point
- **Summarize** — Condense long text into key points
- **Fix grammar** — Correct spelling and grammar issues

### AI Content Generation

- Generate outlines from a topic
- Create structured notes from raw input
- Convert bullet points into full paragraphs

### How to Use in Editor

1. Open any workspace document
2. Select text (or place cursor)
3. Use the AI toolbar button or keyboard shortcut
4. Choose an AI action (rewrite, expand, summarize, etc.)
5. AI generates content inline

---

## Architecture

```
┌────────────────────────────────────────────────┐
│                  Client                        │
│                                                │
│  ┌──────────────┐    ┌──────────────────────┐  │
│  │ ChatInterface│    │ Tiptap Editor        │  │
│  │ Component    │    │ (AI Extension)       │  │
│  └──────┬───────┘    └──────────┬───────────┘  │
│         │                       │              │
│  ┌──────▼───────────────────────▼───────────┐  │
│  │            AiContext Provider             │  │
│  │  - Token management                      │  │
│  │  - Feature flags                         │  │
│  └──────────────────┬───────────────────────┘  │
└─────────────────────┼──────────────────────────┘
                      │ HTTPS (JWT Auth)
┌─────────────────────▼──────────────────────────┐
│            Tiptap Cloud AI Service             │
│  - Natural language processing                 │
│  - Content generation                          │
│  - Contextual responses                        │
└────────────────────────────────────────────────┘
```

### Key Files

| File                                        | Purpose                              |
| ------------------------------------------- | ------------------------------------ |
| `src/contexts/ai-context.tsx`               | AI token provider & feature flags    |
| `src/lib/tiptap-collab-utils.ts`            | Token fetching & URL param utilities |
| `src/app/dashboard/students/edora-ai/`      | Student AI chat page                 |
| `src/app/dashboard/mentor/edora-ai/`        | Mentor AI chat page                  |
| `src/app/dashboard/professionals/edora-ai/` | Professional AI chat page            |
| `src/components/chat/`                      | Shared chat UI components            |

---

## Configuration

### Environment Variables

```env
# Tiptap AI / Collaboration
TIPTAP_COLLAB_SECRET=your_tiptap_collab_secret
```

### Enabling / Disabling AI

AI is enabled by default. To disable it for testing:

```
# Add ?noAi=1 to any URL
http://localhost:3000/dashboard/students/edora-ai?noAi=1
```

Programmatically check AI availability:

```tsx
import { useAi } from "@/contexts/ai-context";

function MyComponent() {
  const { hasAi, aiToken } = useAi();

  if (!hasAi) {
    return <p>AI features are disabled.</p>;
  }

  // Use aiToken to authenticate with AI services
}
```

---

## Connecting with Edora AI

### For Developers — Integrating AI into New Features

#### Step 1: Wrap with AiProvider

Ensure your route/layout is wrapped with the `AiProvider`:

```tsx
import { AiProvider } from "@/contexts/ai-context";
import { useAiToken } from "@/contexts/ai-context";

function MyLayout({ children }) {
  const aiTokenData = useAiToken();

  return <AiProvider value={aiTokenData}>{children}</AiProvider>;
}
```

#### Step 2: Consume AI Context

```tsx
import { useAi } from "@/contexts/ai-context";

function MyAIFeature() {
  const { aiToken, hasAi } = useAi();

  // Use aiToken for authenticated requests to the AI service
  const response = await fetch("/api/ai/generate", {
    headers: { Authorization: `Bearer ${aiToken}` },
    body: JSON.stringify({ prompt: "..." }),
  });
}
```

#### Step 3: Use with Tiptap Editor

The editor automatically uses AI when the `AiContext` has a valid token:

```tsx
import { useAi } from "@/contexts/ai-context";

function EditorWithAI() {
  const { aiToken } = useAi();

  return (
    <TiptapEditor
      aiToken={aiToken}
      // ... other props
    />
  );
}
```

### For Users — Using the AI Chat

1. Navigate to **Edora AI** in your dashboard sidebar
2. Type your question or request in the chat input
3. Edora AI responds with personalized guidance based on your profile
4. Follow the suggested roadmap steps or ask follow-up questions

### AI-Powered Roadmap Generation

1. Complete your **onboarding profile** thoroughly
2. Go to **Roadmap** in your dashboard
3. Click **Generate Roadmap** (or ask Edora AI to create one)
4. Review the AI-generated milestones
5. Customize and start tracking your progress

---

## Best Practices

| Practice                         | Why                                         |
| -------------------------------- | ------------------------------------------- |
| Complete your profile thoroughly | AI uses profile data for personalization    |
| Be specific in prompts           | Better context = better responses           |
| Review AI suggestions            | AI is a guide, not a final authority        |
| Use AI in the editor             | Faster content creation for notes and plans |
| Provide feedback                 | Helps improve AI responses over time        |
