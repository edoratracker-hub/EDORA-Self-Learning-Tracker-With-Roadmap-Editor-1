
import { Calendar } from "@/components/ui/calendar"; // Assuming shadcn calendar exists or using a placeholder
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MentorSchedulePage() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your availability and upcoming sessions.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Calendar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Placeholder for Calendar Component */}
                        <div className="p-4 border rounded-md min-h-[300px] flex items-center justify-center text-muted-foreground">
                            Calendar Component Here
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 border rounded-lg">
                                <div className="font-semibold">Mentoring Session with Alex</div>
                                <div className="text-sm text-muted-foreground">
                                    Today, 2:00 PM - 3:00 PM
                                </div>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <div className="font-semibold">Code Review with Sarah</div>
                                <div className="text-sm text-muted-foreground">
                                    Tomorrow, 10:00 AM - 11:00 AM
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
