import { saveAs } from "file-saver";
import toast from "react-hot-toast";

export async function downloadFile(url: string, fileName: string) {
  try {
    toast.loading("Downloading...", { id: "download" });
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) throw new Error("Download failed");
    const blob = await response.blob();
    saveAs(blob, fileName);
    toast.success("Downloaded!", { id: "download" });
  } catch (err) {
    console.error("Download error:", err);
    toast.dismiss("download");
    window.open(url, "_blank");
    toast.success("Opened in new tab");
  }
}
