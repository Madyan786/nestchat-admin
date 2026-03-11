import { downloadFile } from "@/utils/downloadHelper";

export default function DownloadButton({ url, fileName, label = "Download" }: {
  url: string; fileName: string; label?: string;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); downloadFile(url, fileName); }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {label}
    </button>
  );
}
