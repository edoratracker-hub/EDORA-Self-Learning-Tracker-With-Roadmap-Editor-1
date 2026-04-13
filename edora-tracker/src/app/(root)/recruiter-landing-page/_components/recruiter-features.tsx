import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Users, ShieldCheck, Zap, BarChart, Clock } from "lucide-react";

const features = [
  {
    title: "AI-Powered Matching",
    description:
      "Our advanced algorithms match you with candidates who best fit your job requirements and company culture.",
    icon: Zap,
  },
  {
    title: "Verified Candidates",
    description:
      "Every candidate profile is verified to ensure authenticity, saving you time on background checks.",
    icon: ShieldCheck,
  },
  {
    title: "Smart Filtering",
    description:
      "Filter candidates by skills, experience, location, and more with our intuitive search tools.",
    icon: Search,
  },
  {
    title: "Talent Pool Management",
    description:
      "Build and organize your own talent pools for future hiring needs.",
    icon: Users,
  },
  {
    title: "Real-time Analytics",
    description:
      "Track your hiring performance with detailed insights and reporting dashboards.",
    icon: BarChart,
  },
  {
    title: "Fast Hiring Cycle",
    description:
      "Reduce time-to-hire by up to 50% with our streamlined application management system.",
    icon: Clock,
  },
];

export function RecruiterFeatures() {
  return (
    <section
      id="features"
      className="container py-12 md:py-24 lg:py-32 px-4 md:px-6"
    >
      <div className="flex flex-col items-center justify-center gap-4 text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Why Recruit with Edora?
        </h2>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          We provide the tools you need to find, evaluate, and hire the best
          talent quickly and efficiently.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="transition-all hover:shadow-lg border-muted"
          >
            <CardHeader>
              <feature.icon className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
