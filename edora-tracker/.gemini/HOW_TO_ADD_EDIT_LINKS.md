# How to Add Edit Links to Your Job Listings

To enable users to edit their job postings, you'll need to add edit buttons to your job listing cards. Here's how:

## Example Implementation

In your job listing component (e.g., `RecruiterJobVacancyCards`), add an Edit button:

```tsx
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

// Inside your job card component
<Link href={`/dashboard/recruiter/post-job?id=${job.id}`}>
    <Button variant="outline" size="sm">
        <Pencil className="mr-2 h-4 w-4" />
        Edit
    </Button>
</Link>
```

## Full Card Example

```tsx
<Card key={job.id}>
    <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>{job.company}</CardDescription>
    </CardHeader>
    <CardContent>
        <p>{job.description}</p>
    </CardContent>
    <CardFooter className="flex gap-2">
        <Link href={`/dashboard/recruiter/post-job?id=${job.id}`}>
            <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
            </Button>
        </Link>
        {/* Other buttons */}
    </CardFooter>
</Card>
```

## URL Format

The edit URL uses a query parameter:
- **Create mode:** `/dashboard/recruiter/post-job`
- **Edit mode:** `/dashboard/recruiter/post-job?id=<job-id>`

## Alternative: Using useRouter

If you prefer programmatic navigation:

```tsx
'use client';

import { useRouter } from "next/navigation";

function JobCard({ job }) {
    const router = useRouter();
    
    const handleEdit = () => {
        router.push(`/dashboard/recruiter/post-job?id=${job.id}`);
    };
    
    return (
        <Button onClick={handleEdit} variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
        </Button>
    );
}
```

## Features Included

When the user clicks "Edit":
1. Form pre-fills with existing job data
2. Page title changes to "Edit Job Posting"
3. Submit button shows "Update Job" instead of "Save Job"
4. Delete button appears in edit mode
5. Reset button is hidden (only shown in create mode)

## Security

The backend automatically verifies:
- User owns the job posting
- Job belongs to user's organization
- User has permission to edit

If unauthorized, the user will see a 404 page.
