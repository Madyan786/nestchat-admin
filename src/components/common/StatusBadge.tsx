const statusColors: Record<string, string> = {
  online: "bg-green-100 text-green-700", offline: "bg-gray-100 text-gray-600",
  visible: "bg-green-100 text-green-700", hidden: "bg-gray-100 text-gray-600",
  blocked: "bg-red-100 text-red-700", sent: "bg-blue-100 text-blue-700",
  delivered: "bg-cyan-100 text-cyan-700", read: "bg-green-100 text-green-700",
  answered: "bg-green-100 text-green-700", missed: "bg-red-100 text-red-700",
  rejected: "bg-orange-100 text-orange-700", ended: "bg-gray-100 text-gray-700",
  ringing: "bg-yellow-100 text-yellow-700",
};

export default function StatusBadge({ status }: { status: string }) {
  const color = statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${color}`}>
      {status === "online" && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />}
      {status}
    </span>
  );
}
