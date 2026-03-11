export type MediaType = "image" | "video" | "voice" | "file" | "document";

export interface MediaItem {
  id: string;
  _id?: string;
  originalName: string;
  storedUrl: string;
  fileType: MediaType;
  mimeType: string;
  fileSize: number;
  uploadedBy: string;
  uploaderName: string;
  uploaderPhone: string;
  uploaderAvatar?: string;
  context: "chat" | "group" | "profile" | "group_picture";
  chatPartnerId?: string;
  chatPartnerName?: string;
  groupId?: string;
  groupName?: string;
  messageId?: string;
  duration?: number;
  width?: number;
  height?: number;
  thumbnailUrl?: string;
  flagged: boolean;
  flagReason?: string;
  createdAt: string;
}

export interface MediaListResponse {
  success: boolean;
  media: MediaItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MediaStats {
  totalFiles: number;
  totalSize: number;
  totalSizeFormatted: string;
  byType: {
    type: MediaType;
    count: number;
    size: number;
    sizeFormatted: string;
  }[];
  topUploaders: {
    userId: string;
    name: string;
    phone: string;
    count: number;
    totalSize: number;
  }[];
  recentUploads: number;
}

export interface MediaFilters {
  type?: MediaType | "";
  userId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  flagged?: boolean;
  sortBy?: "createdAt" | "fileSize" | "fileType";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
