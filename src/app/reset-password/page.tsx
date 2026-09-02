"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div className="bg-white shadow-2xl shadow-pink-900/10 rounded-[2rem] border border-pink-100 p-8 sm:p-10">
        
        {success ? (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Password Reset Successfully!</h3>
              <p className="mt-2 text-sm text-gray-500">
                You can now log in with your new password. Redirecting to login page...
              </p>
            </div>
            <Link href="/login" className="clay-btn w-full flex justify-center py-3.5 text-sm font-bold text-white mt-4">
              Go to login now
            </Link>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3.5 rounded-2xl text-sm font-semibold border border-red-100/50 text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#e1467c] uppercase tracking-widest">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-pink-300" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-pink-50/40 border border-pink-100/40 rounded-2xl text-sm font-medium text-[#2d1a26] placeholder-[#4a1a2e]/20 focus:outline-none focus:ring-2 focus:ring-[#e1467c]/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#e1467c] uppercase tracking-widest">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-pink-300" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-pink-50/40 border border-pink-100/40 rounded-2xl text-sm font-medium text-[#2d1a26] placeholder-[#4a1a2e]/20 focus:outline-none focus:ring-2 focus:ring-[#e1467c]/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className={`clay-btn w-full flex justify-center py-3.5 text-sm font-bold text-white ${(loading || !token) ? 'opacity-70' : ''}`}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <div className="flex items-center justify-center text-xs font-semibold pt-2">
              <Link href="/login" className="text-[#4a1a2e]/50 hover:text-[#e1467c] transition-colors flex items-center">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to login
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-72 h-28 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden p-2 border border-pink-200/60" style={{ background: 'linear-gradient(135deg, #fff0f5, #fce4ec)', boxShadow: '0 8px 25px rgba(225,70,124,0.15)' }}>
            <Image src="/lapitex_logo.png" alt="Lapitex Logo" width={700} height={385} className="w-full h-full object-contain" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-black text-[#2d1a26] tracking-tight">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-[#4a1a2e]/50 font-medium">
          Create a new secure password
        </p>
      </div>

      <Suspense fallback={<div className="mt-8 text-center text-sm">Loading secure form...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
