export type MessageType = "text" | "image" | "video" | "voice" | "file" | "document" | "location";

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: MessageType;
  timestamp: string;
  isRead: boolean;
  isDeleted: boolean;
  status: "sent" | "delivered" | "read";
  fileName?: string;
  fileSize?: string;
  mimeType?: string;
  duration?: number;
  location?: { latitude: number; longitude: number; name?: string };
}

export interface ChatListItem {
  profile: {
    id: string;
    phone: string;
    displayName: string;
    avatarUrl?: string;
    online: boolean;
    lastSeen?: string;
  };
  latestMessage?: {
    id: string;
    type: string;
    content: string;
    status: string;
    createdAt: string;
  };
  unreadCount: number;
  pinned: boolean;
}
