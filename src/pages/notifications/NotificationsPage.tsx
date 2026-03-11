import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { notificationsApi } from "@/api/notificationsApi";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  targetType: z.enum(["broadcast", "user"]),
  userId: z.string().optional(),
});

export default function NotificationsPage() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: "", body: "", targetType: "broadcast" as const, userId: "" },
  });
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const targetType = watch("targetType") as "broadcast" | "user";

  const loadHistory = async () => {
    try {
      const res = await notificationsApi.getHistory();
      setHistory(res.data.notifications || []);
      setHistoryLoaded(true);
    } catch { toast.error("Failed to load history"); }
  };

  const onSubmit = async (data: any) => {
    try {
      if (data.targetType === "broadcast") {
        await notificationsApi.broadcast({ title: data.title, body: data.body });
        toast.success("Broadcast sent to all users!");
      } else {
        if (!data.userId) return toast.error("User ID required");
        await notificationsApi.sendToUser({ title: data.title, body: data.body, userId: data.userId });
        toast.success("Notification sent!");
      }
      reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send");
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Send Notification</h1>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register("targetType")} type="radio" value="broadcast" className="text-blue-600" />
                <span className="text-sm">Broadcast to All</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register("targetType")} type="radio" value="user" className="text-blue-600" />
                <span className="text-sm">Specific User</span>
              </label>
            </div>
          </div>
          {targetType === "user" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input {...register("userId")} placeholder="Enter user ID or phone"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input {...register("title")} placeholder="Notification title"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{String(errors.title.message)}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <textarea {...register("body")} rows={4} placeholder="Notification message body..."
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            {errors.body && <p className="text-red-500 text-xs mt-1">{String(errors.body.message)}</p>}
          </div>
          <button type="submit" disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
            {isSubmitting ? "Sending..." : targetType === "broadcast" ? "Send Broadcast" : "Send to User"}
          </button>
        </form>
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">History</h2>
          <button onClick={loadHistory} className="text-sm text-blue-600 hover:underline">
            {historyLoaded ? "Refresh" : "Load History"}
          </button>
        </div>
        {historyLoaded && (
          <div className="space-y-3">
            {history.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No notification history</p>
            ) : (
              history.map((n: any, i: number) => (
                <div key={i} className="bg-white rounded-lg border p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{n.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{n.body}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${n.type === "broadcast" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>
                      {n.type || "broadcast"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{n.createdAt || ""}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
