import {
  BotMessageSquareIcon,
  BriefcaseBusinessIcon,
  ChartBarIcon,
  CompassIcon,
  HelpCircleIcon,
  HomeIcon,
  LockKeyholeIcon,
  MailIcon,
  MapPinIcon,
  School2Icon,
} from "lucide-react";

export const StudentDashboardPaths = {
  utilities: [
    {
      title: "Edora AI",
      url: "/dashboard/edora-ai",
      icon: BotMessageSquareIcon,
      external: true,
    },
    {
      title: "Inbox",
      url: "/dashboard/students/inbox",
      icon: MailIcon,
    },
    {
      title: "Explore",
      url: "/dashboard/students/explore",
      icon: CompassIcon,
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/dashboard/students/home",
      icon: HomeIcon,
    },
    {
      title: "Roadmap",
      url: "http://localhost:3002",
      icon: MapPinIcon,
      external: true,
    },
    {
      title: "Classrooms",
      url: "/dashboard/students/classroom",
      icon: School2Icon,
    },
    {
      title: "Career",
      url: "/dashboard/students/career",
      icon: BriefcaseBusinessIcon,
    },
  ],
  navSecondary: [
    {
      title: "Get Help",
      url: "/dashboard/students/help",
      icon: HelpCircleIcon,
    },
  ],
  navWorkspace: [
    {
      title: "Workspace",
      url: "/dashboard/students/workspace",
      icon: LockKeyholeIcon,
    },
  ],
};
