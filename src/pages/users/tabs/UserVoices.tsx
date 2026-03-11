import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { usersApi } from "@/api/usersApi";
import { motion } from "framer-motion";

interface StorageFile {
  name: string;
  fileName: string;
  path: string;
  downloadUrl: string;
  size: number;
  contentType: string;
  timeCreated: string;
}

export default function UserVoices({ userId }: { userId: string }) {
  const [voices, setVoices] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await usersApi.getUserFiles(userId, "voices");
        setVoices(res.data.files || []);
      } catch { toast.error("Failed to load voice messages"); }
      finally { setLoading(false); }
    })();
  }, [userId]);

  const formatSize = (bytes: number) => {
    if (!bytes) return "";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i];
  };

  const downloadAll = () => {
    if (voices.length === 0) {
      toast.error("No voice messages to download");
      return;
    }
    
    toast.success(`Starting download of ${voices.length} voice messages...`);
    
    voices.forEach((voice, index) => {
      setTimeout(() => {
        // Force download by adding response-content-disposition parameter
        const downloadUrl = voice.downloadUrl + '&response-content-disposition=attachment';
        window.open(downloadUrl, '_blank');
      }, index * 1000);
    });
    
    setTimeout(() => {
      toast.success(`${voices.length} voice messages downloaded - check your downloads folder!`);
    }, voices.length * 1000 + 500);
  };

  const togglePlay = (index: number, url: string) => {
    if (playing === index) {
      audioRef.current?.pause();
      setPlaying(null);
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(url);
    audio.onended = () => setPlaying(null);
    audio.onerror = () => { toast.error("Cannot play audio"); setPlaying(null); };
    audio.play();
    audioRef.current = audio;
    setPlaying(index);
  };

  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"
      />
    </div>
  );

  if (voices.length === 0) return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-dashed border-green-200"
    >
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <svg className="w-20 h-20 mx-auto text-green-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </motion.div>
      <p className="text-green-600 text-lg font-semibold">No voice messages found</p>
      <p className="text-green-400 text-sm mt-1">This user has no voice/audio files in storage</p>
    </motion.div>
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{voices.length} Voice Messages</p>
            <p className="text-xs text-gray-500">Click to play</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadAll}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download All
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {voices.map((voice, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity" />
            <div className="relative flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-200 bg-white hover:shadow-lg transition-all">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => togglePlay(i, voice.downloadUrl)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${playing === i ? "bg-gradient-to-br from-red-500 to-red-600 text-white" : "bg-gradient-to-br from-green-500 to-emerald-500 text-white"}`}
              >
                {playing === i ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </motion.svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </motion.button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate mb-1">{voice.fileName}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">{formatSize(voice.size)}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-xs text-green-600 font-semibold">Audio</span>
                  {playing === i && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-1 text-xs text-red-600 font-semibold"
                    >
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-red-500"
                      />
                      Playing
                    </motion.span>
                  )}
                </div>
              </div>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href={voice.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition shadow-sm"
                title="Download"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
