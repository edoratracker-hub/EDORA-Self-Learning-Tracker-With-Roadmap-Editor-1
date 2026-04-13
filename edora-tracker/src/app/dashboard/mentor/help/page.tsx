
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export default function MentorHelpPage() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
                <p className="text-muted-foreground mt-1">
                    Have questions or need assistance?
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle className="h-5 w-5" />
                            Frequently Asked Questions
                        </CardTitle>
                        <CardDescription>
                            Common questions about mentorship on EDORA.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <details className="group">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                <span>How do I get verified?</span>
                                <span className="transition group-open:rotate-180">
                                    <svg
                                        fill="none"
                                        height="24"
                                        shapeRendering="geometricPrecision"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        viewBox="0 0 24 24"
                                        width="24"
                                    >
                                        <path d="M6 9l6 6 6-6"></path>
                                    </svg>
                                </span>
                            </summary>
                            <p className="text-muted-foreground mt-3 group-open:animate-fadeIn">
                                Complete your profile and submit it for review. Once verified,
                                you'll receive a badge and more visibility.
                            </p>
                        </details>
                        <details className="group">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                <span>When will I get paid?</span>
                                <span className="transition group-open:rotate-180">
                                    <svg
                                        fill="none"
                                        height="24"
                                        shapeRendering="geometricPrecision"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        viewBox="0 0 24 24"
                                        width="24"
                                    >
                                        <path d="M6 9l6 6 6-6"></path>
                                    </svg>
                                </span>
                            </summary>
                            <p className="text-muted-foreground mt-3 group-open:animate-fadeIn">
                                Payments are processed weekly for all completed sessions.
                            </p>
                        </details>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Contact Support</CardTitle>
                        <CardDescription>
                            We are here to help you 24/7.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            If you can't find the answer you're looking for, feel free to contact
                            our support team.
                        </p>
                        <div className="text-sm font-medium">Email: support@edora.com</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
