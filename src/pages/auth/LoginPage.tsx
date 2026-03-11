import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Minimum 6 characters"),
});

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const res = await authApi.login(data);
      if (res.data.success) {
        login(res.data.admin, res.data.token);
        toast.success("Welcome back!");
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-md relative z-10 px-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <span className="text-2xl font-bold text-white">N</span>
            </div>
            <h1 className="text-2xl font-bold text-white">NestChat Admin</h1>
            <p className="text-gray-400 mt-1 text-sm">Sign in to your admin panel</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input {...register("email")} type="email" placeholder="admin@nestchat.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{String(errors.email.message)}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input {...register("password")} type={showPass ? "text" : "password"} placeholder="Enter password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm hover:text-white transition">
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{String(errors.password.message)}</p>}
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 shadow-lg shadow-blue-600/20">
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-600 text-xs mt-6">NestChat Admin Panel v1.0</p>
      </div>
    </div>
  );
}
