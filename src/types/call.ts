export interface CallLog {
  id: string;
  callerId: string;
  callerName: string;
  callerPhone: string;
  callerAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverPhone: string;
  receiverAvatar?: string;
  callType: "audio" | "video";
  status: "initiated" | "ringing" | "answered" | "ended" | "missed" | "rejected";
  duration?: number;
  startTime: string;
  endTime?: string;
}
