export interface BlockRecord {
  id: string;
  blockerProfileId: string;
  blockedProfileId: string;
  blockerPhone?: string;
  blockedPhone?: string;
  blockerName?: string;
  blockedName?: string;
  blockerAvatar?: string;
  blockedAvatar?: string;
  createdAt: string;
}
