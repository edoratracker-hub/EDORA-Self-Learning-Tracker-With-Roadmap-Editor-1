# Job Opportunities Feature Implementation

## Overview
Successfully integrated real job opportunities from the database into the student career page using TanStack Query, replacing static mock data with live data from the API.

## Implementation Summary

### 1. API Route Enhancement (`/api/jobs/route.ts`)
**Changes:**
- Added organization data fetching using Drizzle ORM relations
- Included `recruiterOrganization` join to get company details (name, logo, location, website)
- Added `category` filter parameter support
- Returns organization data with each job posting

**Key Features:**
- Filters: search, type, workMode, location, category
- Only fetches jobs with status "open"
- Returns jobs ordered by creation date (newest first)
- Includes organization details via relational query

### 2. New Hook: `useJobs` (`src/app/hooks/use-jobs.ts`)
**Purpose:** Fetch job opportunities for students with flexible filtering

**Features:**
- TanStack Query integration
- Real-time data fetching from `/api/jobs`
- Support for multiple filter parameters:
  - `search` - Search by title or description
  - `type` - Job type (full-time, part-time, internship, contract, freelance)
  - `workMode` - Remote, hybrid, or on-site
  - `location` - Filter by location or country
  - `category` - Filter by job category

**Return Type:**
```typescript
{
  success: boolean;
  data: JobOpportunityData[];
  count: number;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  error?: string;
}
```

### 3. Career Content Component Update (`career-content.tsx`)

**Major Changes:**
1. **Replaced Static Data** - Removed hardcoded `jobVacancies` array
2. **Live Data Integration** - Using `useJobs()` hook for real-time data
3. **Loading States** - Added loading spinner during data fetch
4. **Error Handling** - Displays error message if fetch fails
5. **Empty States** - Shows appropriate message when no jobs found

**Enhanced JobCard Component:**
- Dynamic salary display from database fields (`salaryMin`, `salaryMax`, `currency`)
- Experience range from `experienceMin` and `experienceMax`
- Posted time calculated using `date-fns` library
- Application deadline formatting
- Skills display limited to 4 with "+X more" indicator
- Work mode badges (Remote, Hybrid, On-site)
- Company name from organization data

**New Features:**
- Search functionality (searches title and description)
- Job type filter (all, full-time, part-time, internship, contract, freelance)
- Location filter (all, remote, specific cities)
- Real-time filtering with query parameters
- Stats update based on actual data:
  - Total opportunities count
  - Active companies count (unique)
  - Remote positions count
  - Jobs posted this week

### 4. Database Schema
The implementation leverages the existing `jobOpportunities` table schema with fields:
- `id`, `title`, `description`, `responsibilities`, `benefits`
- `requiredSkills`, `niceToHaveSkills` (JSONB arrays)
- `experienceMin`, `experienceMax`, `educationRequired`
- `salaryMin`, `salaryMax`, `currency`, `salaryType`
- `jobType`, `workMode`, `location`, `country`
- `applicationDeadline`, `status`, `totalApplicants`, `views`
- `createdAt`
- **Relation:** `organization` (joins with `recruiterOrganization`)

## Data Flow

```
Student Career Page
    ↓
CareerContent Component
    ↓
useJobs Hook (TanStack Query)
    ↓
GET /api/jobs?search=...&type=...
    ↓
Database Query (with Organization join)
    ↓
Returns JobOpportunityData[] with Organization
    ↓
Display in JobCard Components
```

## User Experience

### Before:
- Static list of 8 hardcoded job postings
- No real company data
- Manual filtering logic
- No loading or error states

### After:
- Live data from database
- Real company names, logos, and locations from organizations
- Real-time search and filtering
- Loading spinner during fetch
- Error handling with user feedback
- Empty state with helpful message
- Dynamic stats based on actual data

## Key Features

1. **Real-time Data Sync**
   - Jobs are fetched on component mount
   - Query cache managed by TanStack Query
   - Auto-refetch on window focus (configurable)

2. **Advanced Filtering**
   - Search across title and description
   - Filter by job type, work mode, location
   - Multiple filters can be combined
   - URL query parameters for shareable links

3. **Rich Job Information**
   - Company branding (logo, name from organization)
   - Salary ranges with currency support
   - Experience requirements
   - Required skills display
   - Application deadlines
   - Posted time (human-readable)

4. **Professional UI**
   - Consistent design with existing components
   - Responsive layout (mobile-first)
   - Loading skeletons
   - Error boundaries
   - Empty states

## Future Enhancements

1. **Pagination** - Add pagination for large job lists
2. **Saved Jobs** - Allow students to save/bookmark jobs
3. **Job Details Page** - Detailed view with apply functionality
4. **Application Tracking** - Track application status
5. **Recommendations** - AI-powered job recommendations based on student profile
6. **inbox** - Alert students about new matching jobs
7. **Advanced Filters** - Salary range slider, experience level, education requirements
8. **Sort Options** - Implement sorting by salary, deadline, posted date
9. **Company Pages** - View all jobs from a specific company

## Testing Checklist

- [x] API route returns jobs with organization data
- [x] Hook fetches and caches data correctly
- [x] Component displays loading state
- [x] Component displays error state
- [x] Component displays empty state
- [x] Search filter works
- [x] Type filter works
- [x] Location filter works
- [x] Remote filter works
- [x] Stats calculate correctly
- [x] Job cards display all information
- [x] Date formatting works
- [x] Salary formatting works
- [x] Skills display (truncated to 4)

## Dependencies Used

- `@tanstack/react-query` - Data fetching and caching
- `date-fns` - Date formatting and calculations
- `lucide-react` - Icons
- Existing UI components from `@/components/ui`

## Files Modified/Created

**Created:**
- `src/app/hooks/use-jobs.ts` - New hook for fetching jobs

**Modified:**
- `src/app/api/jobs/route.ts` - Enhanced with organization data
- `src/app/dashboard/students/career/_components/career-content.tsx` - Integrated live data
- `src/app/(root)/choose-role/_components/role-selector.tsx` - Role selection flow
- `src/app/(root)/sign-in/_components/sign-in-form.tsx` - Pass role parameter
- `src/app/(root)/verify-otp/_components/verify-otp-form.tsx` - Role-based redirection

**Documentation:**
- `.gemini/ROLE_AUTH_FLOW.md` - Authentication flow documentation
- `.gemini/JOB_OPPORTUNITIES_IMPLEMENTATION.md` - This document
