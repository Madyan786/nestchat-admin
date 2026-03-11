import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usersApi } from "@/api/usersApi";

interface StorageFile {
  name: string;
  fileName: string;
  path: string;
  downloadUrl: string;
  size: number;
}

export default function UserContacts({ userId }: { userId: string }) {
  const [profilePics, setProfilePics] = useState<StorageFile[]>([]);
  const [storyImages, setStoryImages] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Load user profile images and story images as "profile" tab
        const [profileRes, storyRes] = await Promise.all([
          usersApi.browsePath(`userProfileImage/`).catch(() => ({ data: { files: [] } })),
          usersApi.browsePath(`storyImages/${userId}/`).catch(() => ({ data: { files: [] } })),
        ]);
        setProfilePics((profileRes.data.files || []).filter((f: any) => f.name.includes(userId) || f.fullPath.includes(userId)));
        setStoryImages(storyRes.data.files || []);
      } catch { toast.error("Failed to load profile data"); }
      finally { setLoading(false); }
    })();
  }, [userId]);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;

  const total = profilePics.length + storyImages.length;

  if (total === 0) return (
    <div className="text-center py-16">
      <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
      <p className="text-gray-400 text-sm">No profile data found for this user</p>
    </div>
  );

  return (
    <div>
      {/* User Info Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {userId.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{userId}</h3>
            <p className="text-sm text-gray-500 mt-1">{userId.startsWith("+") ? "Phone number user" : "Firebase Auth UID"}</p>
            <div className="flex gap-4 mt-2">
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{profilePics.length} profile pics</span>
              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">{storyImages.length} stories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Story Images */}
      {storyImages.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Story Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {storyImages.map((img, i) => (
              <a key={i} href={img.downloadUrl} target="_blank" rel="noreferrer" className="group relative aspect-square rounded-xl overflow-hidden border bg-gray-100 hover:shadow-lg transition">
                <img src={img.downloadUrl} alt={img.name} className="w-full h-full object-cover" loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='12'%3EStory%3C/text%3E%3C/svg%3E"; }} />
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition">
                  <p className="text-white text-[10px] truncate">{img.name}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
