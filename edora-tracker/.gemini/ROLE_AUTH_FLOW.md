# Role-Based Authentication Flow Implementation

## Overview
This implementation creates a complete role-based authentication flow where users select their role, sign in with email OTP, and get redirected to the appropriate dashboard.

## Flow Diagram
```
Choose Role Page → Sign In → Email OTP → Verify OTP → Role-Based Dashboard
     (role)          (role)     (role)       (role)        (student/mentor/professional/recruiter)
```

## Implementation Details

### 1. Role Selection (`/choose-role`)
**File**: `src/app/(root)/choose-role/_components/role-selector.tsx`

- Users select from 3 roles: Student, Mentor, or Professional
- When clicking "Select Role" button, user is redirected to `/sign-in?role={roleId}`
- Role parameter is passed through URL to maintain state

### 2. Sign In (`/sign-in?role={roleId}`)
**File**: `src/app/(root)/sign-in/_components/sign-in-form.tsx`

- Captures the `role` parameter from URL
- User enters their email
- Calls `checkUserStatus(email, role)` to ensure user exists (creates if new)
- Sends OTP via `authClient.emailOtp.sendVerificationOtp()`
- Redirects to `/verify-otp?email={email}&role={role}`

### 3. Email OTP Sent
- User receives 6-digit OTP code in their email
- Email is sent using Better Auth's email OTP functionality

### 4. Verify OTP (`/verify-otp?email={email}&role={role}`)
**File**: `src/app/(root)/verify-otp/_components/verify-otp-form.tsx`

- Captures both `email` and `role` parameters from URL
- User enters the 6-digit OTP code
- Verifies code using `authClient.signIn.emailOtp()`
- On successful verification, redirects based on role:

#### Role-Based Redirection Logic:
  
**Student** → `/dashboard/students/profile-setup`
- New students complete their profile setup

**Mentor** → `/dashboard/mentor/profile`
- Mentors access their mentor dashboard

**Professional** → `/dashboard/mentor-professional/profile-setup`
- Professionals set up their professional profile

**Recruiter** → Complex flow:
1. Check if organization exists
2. If no organization → `/recruiter-landing-page`
3. If organization exists but not verified → `/recruiter-organization-completed`
4. If organization verified → `/dashboard/recruiter`

**Admin** → `/dashboard/admin`
- Admins access admin dashboard

**Default** → `/`
- Fallback to homepage

## Key Files Modified

1. **Role Selector Component**
   - Added onClick handler to navigate with role parameter
   - Loading state management

2. **Sign-In Form**
   - Extracts role from URL
   - Passes role to `checkUserStatus()`
   - Includes role in OTP verification redirect

3. **Verify OTP Form**
   - Extracts role from URL
   - Uses role for redirection (prioritizes URL parameter over database)
   - Handles all role types with specific dashboard routes

4. **Sign-In Action** (`src/app/actions/sign-in.ts`)
   - Updated `checkUserStatus()` to accept optional `role` parameter
   - Creates new users with the selected role if they don't exist

## User Experience

### New User Flow:
1. Visits homepage → Clicks "Get Started Free"
2. Lands on `/choose-role` → Selects "Student"
3. Redirected to `/sign-in?role=student`
4. Enters email → OTP sent
5. Redirected to `/verify-otp?email=user@example.com&role=student`
6. Enters OTP code → Verified
7. Redirected to `/dashboard/students`

### Returning User Flow:
1. Visits `/sign-in` (no role parameter)
2. Enters email → OTP sent
3. Enters OTP → Redirected based on role stored in database

## Security Considerations

- Role is stored in database during user creation
- URL parameter only used for initial signup flow
- Existing users' roles are retrieved from database
- Session is created only after successful OTP verification
- `checkAndRedirectSession()` prevents authenticated users from accessing auth pages

## Future Enhancements

1. Add role verification middleware
2. Implement role-based permissions
3. Add ability to change roles (with admin approval)
4. Add multi-role support (user can have multiple roles)
