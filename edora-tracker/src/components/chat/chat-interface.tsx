"use client";

interface ChatInterfaceProps {
  currentUserId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar?: string;
}

export function ChatInterface({
  currentUserId,
  otherUserId,
  otherUserName,
  otherUserAvatar,
}: ChatInterfaceProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <p className="text-muted-foreground">
        Chat with {otherUserName} — coming soon
      </p>
    </div>
  );
}
