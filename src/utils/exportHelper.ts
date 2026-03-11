import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportContactsToExcel(contacts: any[]) {
  const data = contacts.map((c, i) => ({
    "#": i + 1,
    "Name": c.displayName,
    "Phone": c.phone,
    "Custom Name": c.customName || "-",
    "Online": c.online ? "Yes" : "No",
    "Visible": c.isVisible ? "Yes" : "No",
    "Number Visible": c.isNumberVisible ? "Yes" : "No",
    "Random Number": c.randomNumber || "-",
    "Avatar": c.avatarUrl || "No Avatar",
    "Last Seen": c.lastSeen || "-",
    "Joined": c.createdAt || "-",
    "On App": c.isOnApp ? "Yes" : "No",
    "FCM Token": c.fcmToken ? "Present" : "None",
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  ws["!cols"] = [
    { wch: 5 }, { wch: 20 }, { wch: 18 }, { wch: 15 },
    { wch: 8 }, { wch: 8 }, { wch: 15 }, { wch: 12 },
    { wch: 40 }, { wch: 20 }, { wch: 20 }, { wch: 8 }, { wch: 10 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Contacts");
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([buf], { type: "application/octet-stream" }), `nestchat_contacts_${Date.now()}.xlsx`);
}

export function exportVoicesToExcel(voices: any[]) {
  const data = voices.map((v, i) => ({
    "#": i + 1,
    "File Name": v.originalName || v.fileName || "-",
    "Duration (sec)": v.duration || "-",
    "File Size": formatFileSize(v.fileSize),
    "MIME Type": v.mimeType || "-",
    "Uploaded By": v.uploaderName || "-",
    "Uploader Phone": v.uploaderPhone || "-",
    "Context": v.context || "-",
    "Group Name": v.groupName || "-",
    "URL": v.storedUrl || v.content || "-",
    "Date": v.createdAt || "-",
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Voice Messages");
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([buf], { type: "application/octet-stream" }), `nestchat_voices_${Date.now()}.xlsx`);
}

export function exportImagesToExcel(images: any[]) {
  const data = images.map((img, i) => ({
    "#": i + 1,
    "File Name": img.originalName || img.fileName || "-",
    "File Size": formatFileSize(img.fileSize),
    "MIME Type": img.mimeType || "-",
    "Uploaded By": img.uploaderName || "-",
    "Uploader Phone": img.uploaderPhone || "-",
    "Context": img.context || "-",
    "URL": img.storedUrl || img.content || "-",
    "Flagged": img.flagged ? "Yes" : "No",
    "Date": img.createdAt || "-",
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Images");
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([buf], { type: "application/octet-stream" }), `nestchat_images_${Date.now()}.xlsx`);
}

export function exportVideosToExcel(videos: any[]) {
  const data = videos.map((v, i) => ({
    "#": i + 1,
    "File Name": v.originalName || v.fileName || "-",
    "Duration (sec)": v.duration || "-",
    "Duration (formatted)": v.duration ? formatDuration(v.duration) : "-",
    "File Size": formatFileSize(v.fileSize),
    "MIME Type": v.mimeType || "-",
    "Uploaded By": v.uploaderName || "-",
    "Context": v.context || "-",
    "URL": v.storedUrl || v.content || "-",
    "Date": v.createdAt || "-",
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Videos");
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([buf], { type: "application/octet-stream" }), `nestchat_videos_${Date.now()}.xlsx`);
}

export function exportDocumentsToExcel(docs: any[]) {
  const data = docs.map((d, i) => ({
    "#": i + 1,
    "File Name": d.originalName || d.fileName || "-",
    "File Size": formatFileSize(d.fileSize),
    "MIME Type": d.mimeType || "-",
    "Uploaded By": d.uploaderName || "-",
    "Context": d.context || "-",
    "URL": d.storedUrl || d.content || "-",
    "Date": d.createdAt || "-",
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Documents");
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([buf], { type: "application/octet-stream" }), `nestchat_documents_${Date.now()}.xlsx`);
}

export function exportAllMediaToExcel(media: any[]) {
  const wb = XLSX.utils.book_new();
  const types = ["image", "video", "voice", "file", "document"];
  types.forEach((type) => {
    const filtered = media.filter((m) => m.fileType === type || m.type === type);
    if (filtered.length === 0) return;
    const data = filtered.map((m, i) => ({
      "#": i + 1,
      "File Name": m.originalName || m.fileName || "-",
      "Type": m.fileType || m.type || "-",
      "Size": formatFileSize(m.fileSize),
      "MIME": m.mimeType || "-",
      "Duration": m.duration || "-",
      "Uploaded By": m.uploaderName || "-",
      "Phone": m.uploaderPhone || "-",
      "Context": m.context || "-",
      "URL": m.storedUrl || m.content || "-",
      "Date": m.createdAt || "-",
    }));
    const sheetName = type.charAt(0).toUpperCase() + type.slice(1) + "s";
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), sheetName);
  });
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([buf], { type: "application/octet-stream" }), `nestchat_all_media_${Date.now()}.xlsx`);
}

export function formatFileSize(bytes: number | undefined | null): string {
  if (!bytes || bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
