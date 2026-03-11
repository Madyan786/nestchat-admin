export interface Group {
  id: string;
  name: string;
  channelId?: string;
  createdBy: string;
  members: string[];
  musicUrl?: string;
  pictureUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastMessageTime?: string;
}

export interface GroupMessage {
  id: string;
  senderId: string;
  groupId: string;
  type: "text" | "voice" | "image" | "video" | "file";
  content: string;
  status: "sent" | "delivered" | "read";
  duration?: number;
  fileType?: string;
  fileName?: string;
  createdAt: string;
  senderDisplayName?: string;
  deletedFor?: string[];
}
