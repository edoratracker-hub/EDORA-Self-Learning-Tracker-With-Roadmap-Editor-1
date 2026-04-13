import {
    BotMessageSquareIcon,

    ChartBarIcon,
    CompassIcon,
    HomeIcon,
    LockKeyholeIcon,

    BriefcaseIcon,
    MapIcon,
    GraduationCapIcon,
    InboxIcon,
} from "lucide-react";

export const MentorDashboardPaths = {
    user: {
        name: "Mentor",
        email: "mentor@example.com",
        avatar: "/avatars/mentor.jpg",
    },
    utilities: [
        {
            title: "Edora AI",
            url: "/dashboard/edora-ai",
            icon: BotMessageSquareIcon,
            external: true,
        },
        {
            title: "Inbox",
            url: "/dashboard/mentor/messages",
            icon: InboxIcon,
        },
        {
            title: "Explore",
            url: "/dashboard/mentor/explore",
            icon: CompassIcon,
        },
    ],
    navMain: [
        {
            title: "Home",
            url: "/dashboard/mentor/home",
            icon: HomeIcon,
        },
        {
            title: "Classroom",
            url: "/dashboard/mentor/classroom",
            icon: GraduationCapIcon,
        },
        {
            title: "Career",
            url: "/dashboard/mentor/career",
            icon: BriefcaseIcon,
        },
        {
            title: "Roadmap",
            url: "http://localhost:3002",
            icon: MapIcon,
            external: true,
        },
    ],
    navWorkspace: [
        {
            title: "Workspace",
            url: "/dashboard/mentor/workspace",
            icon: LockKeyholeIcon,
        },
    ],
};
