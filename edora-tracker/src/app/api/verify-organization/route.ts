import { db } from "@/drizzle/db";
import { recruiterOrganization } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const organizationId = searchParams.get("id");

        if (!organizationId) {
            return NextResponse.json(
                { error: "Organization ID is required" },
                { status: 400 }
            );
        }

        // Update organization to verified
        await db
            .update(recruiterOrganization)
            .set({ verified: true })
            .where(eq(recruiterOrganization.id, organizationId));

        // Redirect to success page or return HTML
        return new NextResponse(
            `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Organization Verified</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 3rem;
              border-radius: 1rem;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              text-align: center;
              max-width: 500px;
            }
            .icon {
              width: 80px;
              height: 80px;
              background: #10b981;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-center;
              margin: 0 auto 1.5rem;
            }
            .checkmark {
              color: white;
              font-size: 48px;
              font-weight: bold;
            }
            h1 {
              color: #1a202c;
              margin-bottom: 0.5rem;
            }
            p {
              color: #4a5568;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">
              <div class="checkmark">✓</div>
            </div>
            <h1>Organization Verified!</h1>
            <p>
              The organization has been successfully verified.<br>
              The recruiter can now access their dashboard.
            </p>
          </div>
        </body>
      </html>
      `,
            {
                status: 200,
                headers: {
                    "Content-Type": "text/html",
                },
            }
        );
    } catch (error) {
        console.error("Error verifying organization:", error);
        return NextResponse.json(
            { error: "Failed to verify organization" },
            { status: 500 }
        );
    }
}
