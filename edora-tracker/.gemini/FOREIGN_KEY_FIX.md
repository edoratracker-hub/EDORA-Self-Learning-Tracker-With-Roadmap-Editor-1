# Foreign Key Constraint Fix - Job Opportunities

## Problem

When creating a job opportunity, the application was throwing a foreign key constraint error:

```
error: insert or update on table "job_opportunities" violates foreign key constraint 
"job_opportunities_company_recruiter_organization_id_fk"

detail: 'Key (company)=(Researck ) is not present in table "recruiter_organization".'
```

## Root Cause

The `company` field in the `jobOpportunities` table has a foreign key constraint that references `recruiterOrganization.id`:

```typescript
company: text("company").references(() => recruiterOrganization.id, { onDelete: "cascade" })
```

This means the `company` field **must contain an organization UUID**, not a company name string.

However, the `createJobOpportunity` function in `src/app/actions/recruiters/create-job-post.ts` was incorrectly accepting the company name from the form data and trying to insert it directly:

```typescript
// ❌ WRONG - This tries to insert "Researck " (a company name)
await db.insert(jobOpportunities).values({
    id: crypto.randomUUID(),
    recruiterId: session.user.id,
    ...otherData, // This included company: "Researck "
    // ...
});
```

## Solution

### Changes Made

1. **Fetch Organization ID** - Before inserting, query the database to get the recruiter's organization:
   ```typescript
   const organization = await db.query.recruiterOrganization.findFirst({
       where: eq(recruiterOrganization.userId, session.user.id)
   });
   ```

2. **Early Return if No Organization** - Prevent job creation if recruiter hasn't set up an organization:
   ```typescript
   if (!organization) {
       return {
           success: false,
           error: "You must set up an organization first",
       };
   }
   ```

3. **Filter Out Company from Form Data** - Skip the company field from form data parsing:
   ```typescript
   formData.forEach((value, key) => {
       // Skip company field from form data since we'll use organization ID
       if (key === "company") {
           return;
       }
       // ... rest of the parsing logic
   });
   ```

4. **Use Organization ID** - Set the company field to the organization ID:
   ```typescript
   await db.insert(jobOpportunities).values({
       id: crypto.randomUUID(),
       recruiterId: session.user.id,
       company: organization.id, // ✅ CORRECT - Use organization UUID
       ...otherData,
       // ...
   });
   ```

## Files Modified

**File:** `src/app/actions/recruiters/create-job-post.ts`

**Changes:**
- Added import for `recruiterOrganization` schema and `eq` operator
- Fetch organization before validation
- Added organization check with appropriate error message
- Filter out company field from form data
- Explicitly set `company: organization.id` in insert statement

## Note: Two createJobOpportunity Functions

There are two `createJobOpportunity` functions in the codebase:

1. **`src/app/actions/recruiters/create-job-post.ts`** (Fixed) ✅
   - Used by older job posting forms
   - Was broken, now fixed

2. **`src/app/actions/recruiter-actions.ts`** (Already Correct) ✅
   - Line 126
   - Already correctly uses `company: organization.id`
   - Used by newer job posting implementation

### Recommendation

Consider consolidating these two functions into one to avoid duplication and potential inconsistencies. The implementation in `recruiter-actions.ts` is more robust and should be the primary one.

## Testing

After the fix, job creation should work correctly:

1. Recruiter must have a verified organization
2. When creating a job, the organization ID is automatically fetched
3. Job is linked to the organization via the foreign key
4. Students can see the company information when viewing jobs

## Database Schema Reference

```typescript
// recruiter_organization table
export const recruiterOrganization = pgTable("recruiter_organization", {
  id: text("id").primaryKey(), // This is what company field should reference
  companyName: text("companyName"),
  // ... other fields
})

// job_opportunities table  
export const jobOpportunities = pgTable("job_opportunities", {
  id: text("id").primaryKey(),
  recruiterId: text("recruiter_id").references(() => user.id),
  company: text("company").references(() => recruiterOrganization.id), // FK constraint
  // ... other fields
})
```

## Key Takeaway

When a field has a foreign key constraint, it must reference the **primary key** of the related table (usually a UUID), not a human-readable name or other field.
