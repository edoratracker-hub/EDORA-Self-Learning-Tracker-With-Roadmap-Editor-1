"use client";

import { useEffect, useState } from "react";
import { getMentors } from "@/app/actions/student-actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Star, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function MentorsPage() {
    const [mentors, setMentors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMentors = async () => {
            const result = await getMentors();
            if (result.success) {
                setMentors(result.mentors || []);
            }
            setLoading(false);
        };
        loadMentors();
    }, []);

    if (loading) {
        return (
            <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-4/5" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (mentors.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
                <div className="rounded-full bg-muted p-6 mb-4">
                    <Briefcase className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No mentors found</h3>
                <p className="text-muted-foreground mt-2 max-w-sm">
                    Check back later as more mentors join our platform.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mentors</h1>
                <p className="text-muted-foreground mt-1">
                    Connect with industry experts to accelerate your career.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {mentors.map((mentor) => (
                    <Card key={mentor.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3 relative">
                            <div className="absolute top-4 right-4 flex gap-1">
                                {mentor.rating > 0 && (
                                    <Badge variant="secondary" className="gap-1">
                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        {mentor.rating.toFixed(1)}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex flex-col items-center text-center mt-2">
                                <Avatar className="h-20 w-20 border-4 border-background shadow-sm mb-3">
                                    <AvatarImage src={mentor.profileImage} alt={mentor.fullName} />
                                    <AvatarFallback>{mentor.fullName?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-lg">{mentor.fullName}</CardTitle>
                                <CardDescription className="flex items-center mt-1">
                                    {mentor.title}
                                    {mentor.company && ` at ${mentor.company}`}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4 text-sm">
                            {mentor.location && (
                                <div className="flex items-center text-muted-foreground gap-2">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {mentor.location}
                                </div>
                            )}

                            {mentor.bio && (
                                <p className="line-clamp-3 text-muted-foreground">
                                    {mentor.bio}
                                </p>
                            )}

                            {mentor.expertise && mentor.expertise.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {mentor.expertise.slice(0, 3).map((skill: string) => (
                                        <Badge key={skill} variant="outline" className="text-xs font-normal">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {mentor.expertise.length > 3 && (
                                        <Badge variant="outline" className="text-xs font-normal">
                                            +{mentor.expertise.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="pt-0 pb-4 px-6">
                            <Button asChild className="w-full gap-2">
                                <Link href={`/dashboard/students/inbox?userId=${mentor.userId}`}>
                                    <MessageSquare className="h-4 w-4" />
                                    Message Monitor
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
