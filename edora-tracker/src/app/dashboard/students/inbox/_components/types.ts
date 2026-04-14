export interface Conversation {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  online: boolean;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "other";
  timestamp: Date;
  read?: boolean;
}

export type NotificationType = 
  | "collab_invite"
  | "interview_scheduled"
  | "interview_rescheduled"
  | "study_reminder"
  | "calendar_reminder"
  | "calendar_event"
  | "mentor_verification"
  | "general"
  | "daily_task_missed"
  | "daily_task_completed"
  | "milestone_achieved"
  | "roadmap_updated"
  | "workspace_update"
  | "achievement_unlocked";

export interface AppNotification {
  id: string;
  userId: string;
  fromUserId?: string;
  fromUserName?: string;
  fromUserImage?: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  metadata?: Record<string, any> | string;
  createdAt: Date;
}
