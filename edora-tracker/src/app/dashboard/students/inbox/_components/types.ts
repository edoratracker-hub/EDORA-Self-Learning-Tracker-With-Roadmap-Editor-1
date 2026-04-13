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
