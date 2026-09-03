"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else if (res?.ok) {
      window.location.href = "/auth-redirect";
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-72 h-28 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden p-2 border border-pink-200/60" style={{ background: 'linear-gradient(135deg, #fff0f5, #fce4ec)', boxShadow: '0 8px 25px rgba(225,70,124,0.15)' }}>
            <Image src="/lapitex_logo.png" alt="Lapitex Logo" width={700} height={385} className="w-full h-full object-contain" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-black text-[#2d1a26] tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-[#4a1a2e]/50 font-medium">
          Sign in to your Lapitex account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white shadow-2xl shadow-pink-900/10 rounded-[2rem] border border-pink-100 p-8 sm:p-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3.5 rounded-2xl text-sm font-semibold border border-red-100/50 text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#e1467c] uppercase tracking-widest">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-pink-50/40 border border-pink-100/40 rounded-2xl text-sm font-medium text-[#2d1a26] placeholder-[#4a1a2e]/20"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#e1467c] uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 pr-12 py-3 bg-pink-50/40 border border-pink-100/40 rounded-2xl text-sm font-medium text-[#2d1a26] placeholder-[#4a1a2e]/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-[#4a1a2e]/45 hover:text-[#e1467c]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`clay-btn w-full flex justify-center py-3.5 text-sm font-bold text-white ${loading ? 'opacity-70' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="flex items-center justify-between text-xs font-semibold pt-1">
              <Link href="/register" className="text-[#e1467c] hover:text-[#c23066] transition-colors">
                Sign Up
              </Link>
              <Link href="/forgot-password" className="text-[#4a1a2e]/50 hover:text-[#e1467c] transition-colors">
                Forgot Password?
              </Link>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}
