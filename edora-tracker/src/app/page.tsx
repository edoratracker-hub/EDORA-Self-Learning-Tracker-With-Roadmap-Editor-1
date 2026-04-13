import { ColophonSection } from "./_components/colophon-section";
import { HeroSection } from "./_components/hero-section";
import { PricingSection } from "./_components/pricing-section";
import { PrinciplesSection } from "./_components/principles-section";
import { RootHeader } from "./_components/root-header";
import { SignalsSection } from "./_components/signals-section";
import { WorkSection } from "./_components/work-section";

export default function Page() {
  return (
    <main className=" min-h-screen">
      <RootHeader />
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10">
        <HeroSection />
        <SignalsSection />
        <WorkSection />
        <PrinciplesSection />
        <PricingSection />
        <ColophonSection />
      </div>
    </main>
  );
}
