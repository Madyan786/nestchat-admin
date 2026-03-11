import { useEffect, useState } from "react";
import { analyticsApi } from "@/api/analyticsApi";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#06B6D4"];

export default function ReportsPage() {
  const [usersGrowth, setUsersGrowth] = useState<any[]>([]);
  const [messagesVolume, setMessagesVolume] = useState<any[]>([]);
  const [messageTypes, setMessageTypes] = useState<any[]>([]);
  const [peakHours, setPeakHours] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [gRes, vRes, tRes, pRes, uRes] = await Promise.all([
          analyticsApi.getUsersGrowth(30),
          analyticsApi.getMessagesVolume(7),
          analyticsApi.getMessageTypes(),
          analyticsApi.getPeakHours(),
          analyticsApi.getTopUsers(10),
        ]);
        setUsersGrowth(gRes.data.data || []);
        setMessagesVolume(vRes.data.data || []);
        setMessageTypes(tRes.data.data || []);
        setPeakHours(pRes.data.data || []);
        setTopUsers(uRes.data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports & Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-4">User Growth (30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={usersGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} name="New Users" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-4">Messages Volume (7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={messagesVolume}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Messages" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-4">Message Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={messageTypes} cx="50%" cy="50%" outerRadius={100} dataKey="count" nameKey="type"
                label={({ type, percent }: any) => `${type} ${(percent * 100).toFixed(0)}%`}>
                {messageTypes.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-4">Peak Activity Hours</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={peakHours}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} name="Activity" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="font-semibold text-gray-900 mb-4">Top Active Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Messages</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Calls</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Groups</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topUsers.map((user: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-bold text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{user.displayName || user.name}</p>
                    <p className="text-xs text-gray-400">{user.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold">{user.messageCount || 0}</td>
                  <td className="px-4 py-3 text-sm">{user.callCount || 0}</td>
                  <td className="px-4 py-3 text-sm">{user.groupCount || 0}</td>
                </tr>
              ))}
              {topUsers.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No data available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
