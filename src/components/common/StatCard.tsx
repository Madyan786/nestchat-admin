import { ReactNode } from "react";

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  red: "bg-red-50 text-red-600",
  cyan: "bg-cyan-50 text-cyan-600",
  teal: "bg-teal-50 text-teal-600",
  gray: "bg-gray-50 text-gray-600",
};

export default function StatCard({ title, value, icon, color }: {
  title: string; value: string | number; icon: ReactNode; color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-lg inline-flex mb-4 ${colorMap[color] || colorMap.blue}`}>{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900">{typeof value === "number" ? value.toLocaleString() : value}</h3>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  );
}
