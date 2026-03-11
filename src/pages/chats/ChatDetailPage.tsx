import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/api/axiosInstance";
import AvatarWithStatus from "@/components/common/AvatarWithStatus";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { format } from "date-fns";

export default function ChatDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await api.get(`/api/admin/chats/${id}?page=1`);
        setChat(res.data.chat);
        setMessages(res.data.messages || []);
        setHasMore((res.data.messages || []).length >= 50);
      } catch { toast.error("Chat not found"); navigate("/chats"); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const loadMore = async () => {
    const nextPage = page + 1;
    try {
      const res = await api.get(`/api/admin/chats/${id}?page=${nextPage}`);
      const newMsgs = res.data.messages || [];
      setMessages((prev) => [...prev, ...newMsgs]);
      setPage(nextPage);
      setHasMore(newMsgs.length >= 50);
    } catch { toast.error("Failed to load more"); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/admin/messages/${deleteTarget}`);
      setMessages((prev) => prev.filter((m) => (m.id || m._id) !== deleteTarget));
      toast.success("Message deleted");
      setDeleteTarget(null);
    } catch { toast.error("Failed to delete"); }
  };

  const renderContent = (msg: any) => {
    switch (msg.type) {
      case "image": return <img src={msg.content} alt="" className="max-w-[200px] rounded-lg" />;
      case "video": return <video src={msg.content} controls className="max-w-[250px] rounded-lg" />;
      case "voice": return <audio src={msg.content} controls className="max-w-[250px]" />;
      case "file": case "document":
        return <a href={msg.content} target="_blank" rel="noreferrer" className="text-blue-500 underline text-sm">{msg.fileName || "Download file"}</a>;
      default: return <p className="text-sm">{msg.content}</p>;
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;

  return (
    <div>
      <button onClick={() => navigate("/chats")} className="text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1 text-sm">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> Back to Chats
      </button>
      {chat && (
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <AvatarWithStatus src={chat.participant1?.avatarUrl} name={chat.participant1?.displayName || "User"} online={chat.participant1?.online} />
              <AvatarWithStatus src={chat.participant2?.avatarUrl} name={chat.participant2?.displayName || "User"} online={chat.participant2?.online} />
            </div>
            <div>
              <h2 className="font-bold">{chat.participant1?.displayName} & {chat.participant2?.displayName}</h2>
              <p className="text-xs text-gray-500">{messages.length} messages loaded</p>
            </div>
          </div>
        </div>
      )}
      <div className="bg-gradient-to-b from-gray-100 to-gray-50 rounded-xl border p-4 space-y-3 max-h-[600px] overflow-y-auto">
        {hasMore && (
          <button onClick={loadMore} className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">Load older messages</button>
        )}
        {messages.map((msg: any) => {
          const isSender1 = msg.senderId === chat?.participant1?.id || msg.senderId === chat?.participant1?._id;
          return (
            <div key={msg.id || msg._id} className={`flex ${isSender1 ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${isSender1 ? "bg-white" : "bg-blue-600 text-white"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium ${isSender1 ? "text-gray-500" : "text-blue-100"}`}>
                    {isSender1 ? chat?.participant1?.displayName : chat?.participant2?.displayName}
                  </span>
                  <span className={`text-[10px] ${isSender1 ? "text-gray-400" : "text-blue-200"}`}>
                    {msg.createdAt || msg.timestamp ? format(new Date(msg.createdAt || msg.timestamp), "HH:mm") : ""}
                  </span>
                </div>
                {renderContent(msg)}
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-[10px] ${isSender1 ? "text-gray-400" : "text-blue-200"}`}>{msg.type !== "text" ? msg.type : ""}</span>
                  <button onClick={() => setDeleteTarget(msg.id || msg._id)}
                    className={`text-[10px] px-1.5 py-0.5 rounded ${isSender1 ? "hover:bg-red-50 text-red-400" : "hover:bg-red-500/20 text-red-200"}`}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && <p className="text-center text-gray-400 py-8">No messages</p>}
      </div>
      <ConfirmDialog isOpen={!!deleteTarget} title="Delete Message"
        message="This will permanently delete this message." confirmLabel="Delete"
        variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
