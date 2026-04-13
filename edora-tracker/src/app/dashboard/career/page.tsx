export const dynamic = "force-dynamic";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { CareerHero } from "./_components/career-hero";
import { CareerPathsGrid } from "./_components/career-paths-grid";

export default async function CareerPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <main className="p-6 space-y-12">
      <CareerHero />
      <CareerPathsGrid studentId={session?.user?.id} />
    </main>
  );
}