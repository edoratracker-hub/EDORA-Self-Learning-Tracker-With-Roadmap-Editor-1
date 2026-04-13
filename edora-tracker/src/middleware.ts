import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ──────────────────────────────────────────────
// Role-based routing configuration
// ──────────────────────────────────────────────

type Role = "student" | "mentor" | "professional" | "recruiter" | "admin";

/**
 * Maps each role to the dashboard path prefix it owns.
 * A user may ONLY access routes under their own prefix.
 */
const ROLE_PREFIX: Record<Role, string> = {
  student: "/dashboard/students",
  mentor: "/dashboard/mentor",
  professional: "/dashboard/professionals",
  recruiter: "/dashboard/recruiter",
  admin: "/dashboard/admin",
};

/**
 * Where to send each role after login or when they hit /dashboard.
 */
const ROLE_HOME: Record<Role, string> = {
  student: "/dashboard/students/home",
  mentor: "/dashboard/mentor/home",
  professional: "/dashboard/professionals/home",
  recruiter: "/dashboard/recruiter",
  admin: "/dashboard/admin",
};

/**
 * Shared dashboard routes (under /dashboard but not role-prefixed).
 * These are accessible by the roles listed in their `allow` array.
 */
const SHARED_ROUTES: { prefix: string; allow: Role[] }[] = [
  { prefix: "/dashboard/calendar", allow: ["student", "professional"] },
  { prefix: "/dashboard/career", allow: ["student", "professional"] },
  {
    prefix: "/dashboard/edora-ai",
    allow: ["student", "mentor", "professional", "recruiter", "admin"],
  },
  {
    prefix: "/dashboard/help",
    allow: ["student", "mentor", "professional", "recruiter", "admin"],
  },
];

/** Public routes that never require authentication. */
const PUBLIC_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/verify-otp",
  "/choose-role",
  "/api",
];

/** Routes that need auth but are role-agnostic (onboarding, pending, etc.) */
const AUTH_ONLY_ROUTES = [
  "/mentor-onboarding",
  "/mentor-pending",
  "/professional-onboarding",
  "/recruiter-landing-page",
  "/recruiter-organization",
  "/recruiter-organization-completed",
  "/heatmap",
];

// ──────────────────────────────────────────────
// Helper
// ──────────────────────────────────────────────

function isRole(value: unknown): value is Role {
  return (
    typeof value === "string" &&
    ["student", "mentor", "professional", "recruiter", "admin"].includes(value)
  );
}

// ──────────────────────────────────────────────
// Middleware
// ──────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip public / static / API routes
  if (
    PUBLIC_ROUTES.some((r) => pathname.startsWith(r)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Fetch session from Better Auth (internal call, forwarding cookies)
  let session: { user?: { role?: string } } | null = null;

  try {
    const sessionRes = await fetch(
      new URL("/api/auth/get-session", request.url),
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      },
    );

    if (sessionRes.ok) {
      session = await sessionRes.json();
    }
  } catch {
    // Network error → treat as unauthenticated
  }

  const user = session?.user;

  // 3. No session → redirect to sign-in (except auth-only routes handled below)
  if (!user) {
    // If already heading to a public-ish page, don't loop
    if (
      pathname === "/" ||
      AUTH_ONLY_ROUTES.some((r) => pathname.startsWith(r))
    ) {
      return NextResponse.next();
    }

    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signIn);
  }

  const role = user.role;

  // 4. If role is not set yet → send to choose-role
  if (!isRole(role)) {
    if (pathname === "/choose-role" || pathname === "/") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/choose-role", request.url));
  }

  // 5. Auth-only routes (onboarding, pending) → allow if authenticated
  if (AUTH_ONLY_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // 6. Landing page → allow authenticated users to see the landing page
  if (pathname === "/") {
    return NextResponse.next();
  }

  // 7. Bare /dashboard → redirect to role home
  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  // 8. Dashboard routes → enforce role boundaries
  if (pathname.startsWith("/dashboard")) {
    // 8a. Check shared routes first
    for (const shared of SHARED_ROUTES) {
      if (pathname.startsWith(shared.prefix)) {
        if (shared.allow.includes(role)) {
          return NextResponse.next();
        }
        // Not allowed → redirect to their own dashboard
        return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
      }
    }

    // 8b. Admin can access everything under /dashboard
    if (role === "admin") {
      return NextResponse.next();
    }

    // 8c. Check role-specific prefix
    const allowedPrefix = ROLE_PREFIX[role];
    if (pathname.startsWith(allowedPrefix)) {
      return NextResponse.next();
    }

    // 8d. Accessing a different role's routes → redirect to own home
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  // 9. Everything else → allow
  return NextResponse.next();
}

// ──────────────────────────────────────────────
// Matcher — run middleware on all routes except
// static files and Next.js internals.
// ──────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image  (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
