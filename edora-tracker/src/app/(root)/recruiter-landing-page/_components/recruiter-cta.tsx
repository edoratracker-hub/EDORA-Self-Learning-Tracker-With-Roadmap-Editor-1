import Link from "next/link";
import { Button } from "@/components/ui/button";

export function RecruiterCTA() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 border-t">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 text-center">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Ready to Transform Your Hiring?
          </h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Join thousands of companies using Edora to find their next
            superstar. Get started for free today.
          </p>
        </div>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Link href="/sign-up">
            <Button size="lg" className="h-11 px-8">
              Create Employer Account
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="h-11 px-8">
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
