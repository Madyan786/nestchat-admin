export interface Contact {
  id: string;
  userId?: string;
  phone: string;
  displayName: string;
  avatarUrl?: string | null;
  isVisible: boolean;
  isNumberVisible: boolean;
  randomNumber?: string;
  online: boolean;
  lastSeen?: string | null;
  isOnApp: boolean;
  customName?: string;
  createdAt: string;
  totalMessages?: number;
  totalMedia?: number;
  totalGroups?: number;
  fcmToken?: string;
}

export interface ContactListResponse {
  success: boolean;
  contacts: Contact[];
  page: number;
  limit: number;
  total: number;
}

export interface SavedContact {
  phone: string;
  customName?: string;
  savedAt: string;
  contactProfile?: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    online: boolean;
  };
}
