export interface User {
  id: string;
  userId: string;
  phone: string;
  displayName: string;
  avatarUrl?: string | null;
  isVisible: boolean;
  isNumberVisible: boolean;
  randomNumber?: string;
  online: boolean;
  lastSeen?: string | null;
  fcmToken?: string;
  createdAt: string;
  customName?: string;
  isBlocked?: boolean;
}

export interface UserListResponse {
  success: boolean;
  users: User[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserFilters {
  search?: string;
  online?: boolean | null;
  isVisible?: boolean | null;
  sortBy?: "displayName" | "createdAt" | "lastSeen";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
