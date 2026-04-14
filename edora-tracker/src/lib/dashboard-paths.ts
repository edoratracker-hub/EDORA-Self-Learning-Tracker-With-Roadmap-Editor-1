import {
  BotMessageSquareIcon,
  BriefcaseBusinessIcon,
  CalendarIcon,
  CameraIcon,
  ChartBarIcon,
  ClipboardListIcon,
  CompassIcon,
  DatabaseIcon,
  FileTextIcon,
  HelpCircleIcon,
  HomeIcon,
  LockKeyholeIcon,
  Mail,
  MailIcon,
  MapPin,
  MapPinIcon,
  School2Icon,
  SearchIcon,
  SettingsIcon,
  SparkleIcon,
  SparklesIcon,
  UserCircleIcon,
} from "lucide-react";

export const DashboardPaths = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
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
      url: "/dashboard/professionals/inbox",
      icon: MailIcon,
    },
    {
      title: "Explore",
      url: "/dashboard/professionals/explore",
      icon: CompassIcon,
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/dashboard/professionals/home",
      icon: HomeIcon,
    },
    {
      title: "Roadmap",
      url: "http://localhost:3002",
      icon: MapPinIcon,
      external: true,
    },
    {
      title: "Career",
      url: "/dashboard/professionals/career",
      icon: BriefcaseBusinessIcon,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: ClipboardListIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Get Help",
      url: "/dashboard/professionals/help",
      icon: HelpCircleIcon,
    },
  ],
  navWorkspace: [
    {
      title: "Workspace",
      url: "/dashboard/professionals/workspace",
      icon: LockKeyholeIcon,
    },
  ],
};
