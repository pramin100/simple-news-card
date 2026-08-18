"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  User,
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileText,
  Info,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!loginUsername || !loginPassword) {
      setError("प्रयोगकर्ताको नाम र पासवर्ड हान्नुहोस् (Enter username and password)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "लगइन गर्न सकिएन (Login failed)");
      }

      setSuccess("लगइन सफल भयो! कार्ड स्टुडियो खुल्दैछ...");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 700);
    } catch (err: any) {
      setError(err.message || "लगइन गर्दा समस्या आयो");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-950 to-slate-950 flex items-center justify-center p-4 selection:bg-brand-500 selection:text-white">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-orange/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
        {/* Brand Header */}
        <div className="px-8 pt-8 pb-6 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent-orange to-amber-400 text-white font-black text-2xl shadow-lg shadow-accent-orange/30 mb-3">
            N
          </div>
          <h1 className="text-xl font-bold text-slate-900">Nepali News Card Studio</h1>
          <p className="text-xs text-slate-500 mt-1">सामाजिक सञ्जाल समाचार कार्ड तथा पोस्टर मेकर</p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-start gap-2 animate-fade-in">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                प्रयोगकर्ताको नाम (Username) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="उदा: admin वा editor"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 pl-10"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                पासवर्ड (Password) *
              </label>
              <div className="relative">
                <input
                  type={showLoginPass ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="पासवर्ड हान्नुहोस्"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 pl-10 pr-10"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-900 to-brand-800 hover:from-brand-950 hover:to-brand-900 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-900/25 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              <span>लगइन गर्नुहोस् (Sign In)</span>
            </button>
          </form>

          {/* Admin Managed Note */}
          <div className="mt-5 p-3 bg-amber-50/80 border border-amber-200/70 rounded-2xl flex items-start gap-2.5 text-amber-800 text-[11px]">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
            <p className="leading-relaxed">
              <strong>नोट:</strong> नयाँ खाता केवल एडमिन (Admin) ले मात्र सिर्जना गर्न सक्छ । नयाँ पहुँचको लागि आफ्नो एडमिनलाई सम्पर्क गर्नुहोस् ।
            </p>
          </div>

          {/* Storage note */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>सुरक्षित फाइल आधारित भण्डारण (Secure Storage)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
