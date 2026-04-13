import { db } from "@/drizzle/db"
import { user } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("id")

  if (!userId) {
    return new NextResponse("Missing user ID", { status: 400 })
  }

  try {
    await db
      .update(user)
      .set({ emailVerified: true })
      .where(eq(user.id, userId))

    return new NextResponse("User verified successfully. You can now close this page.", {
      status: 200,
    })
  } catch (error) {
    return new NextResponse("Failed to verify user", { status: 500 })
  }
}
