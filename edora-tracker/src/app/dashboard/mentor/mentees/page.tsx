import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MenteesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mentees</h1>
        <p className="text-muted-foreground mt-1">
          Manage all your active mentees
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder Mentee Cards */}
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`/avatars/0${i}.png`} alt="Mentee" />
                <AvatarFallback>M{i}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <CardTitle>Mentee Name {i}</CardTitle>
                <CardDescription>Web Development Track</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">Session Progress</div>
              <div className="text-xs text-muted-foreground mt-1">
                5 of 12 sessions completed
              </div>
              <div className="h-2 w-full bg-secondary mt-2 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[40%]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
