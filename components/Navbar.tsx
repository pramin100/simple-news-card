"use client";

import React, { useState } from "react";
import {
  Download,
  RotateCcw,
  User,
  KeyRound,
  LogOut,
  Sparkles,
  Share2,
  Check,
  Palette,
  ChevronDown,
  Shield,
  Users,
} from "lucide-react";
import { CardState } from "@/lib/canvasRenderer";

interface NavbarProps {
  user: {
    id: string;
    username: string;
    fullName: string;
    role: string;
  } | null;
  onReset: () => void;
  onDownload: (format: "png" | "jpeg") => void;
  onCopyImage: () => void;
  onOpenChangePassword: () => void;
  onOpenUserManagement?: () => void;
  onLogout: () => void;
  onApplyPreset: (presetName: string) => void;
  isDownloading: boolean;
}

export default function Navbar({
  user,
  onReset,
  onDownload,
  onCopyImage,
  onOpenChangePassword,
  onOpenUserManagement,
  onLogout,
  onApplyPreset,
  isDownloading,
}: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    onCopyImage();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-50 h-14 bg-brand-900 border-b border-brand-800/80 shadow-lg px-4 md:px-6 flex items-center justify-between select-none">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-orange to-amber-400 flex items-center justify-center shadow-md shadow-accent-orange/30 text-white font-extrabold text-lg">
            N
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold text-sm tracking-wide">News Card</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-800 text-brand-200 border border-brand-700 font-semibold uppercase">
                Studio
              </span>
            </div>
            <p className="text-[10px] text-brand-300 hidden sm:block">नेपाली सोसल मिडिया कार्ड मेकर</p>
          </div>
        </div>

        {/* Preset Styles Dropdown */}
        <div className="relative ml-2 hidden md:block">
          <button
            onClick={() => setShowPresetMenu(!showPresetMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-100 bg-brand-800/80 hover:bg-brand-800 border border-brand-700/80 rounded-lg transition-all"
          >
            <Palette className="w-3.5 h-3.5 text-accent-orange" />
            <span>थिम टेम्प्लेट (Presets)</span>
            <ChevronDown className="w-3 h-3 text-brand-300" />
          </button>

          {showPresetMenu && (
            <div
              className="absolute left-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fade-in"
              onMouseLeave={() => setShowPresetMenu(false)}
            >
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                तयारी डिजाइनहरू
              </div>
              <button
                onClick={() => {
                  onApplyPreset("breaking");
                  setShowPresetMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <span>ब्रेकिङ न्युज (Breaking Red)</span>
              </button>
              <button
                onClick={() => {
                  onApplyPreset("classic_blue");
                  setShowPresetMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>क्लासिक निलो (Classic Blue)</span>
              </button>
              <button
                onClick={() => {
                  onApplyPreset("dark_edition");
                  setShowPresetMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
                <span>डार्क मोड (Dark Edition)</span>
              </button>
              <button
                onClick={() => {
                  onApplyPreset("gold_luxury");
                  setShowPresetMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>गोल्ड लक्जरी (Gold Edition)</span>
              </button>
              <button
                onClick={() => {
                  onApplyPreset("emerald");
                  setShowPresetMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>हरियो ताजा (Emerald Fresh)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Admin Quick Action Button */}
        {isAdmin && onOpenUserManagement && (
          <button
            onClick={onOpenUserManagement}
            title="प्रयोगकर्ता व्यवस्थापन (Admin only)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg transition-all active:scale-95"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">प्रयोगकर्ता व्यवस्थापन</span>
          </button>
        )}

        {/* Reset Button */}
        <button
          onClick={onReset}
          title="सबै फेरि सुरु गर्नुहोस्"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-200 hover:text-white bg-transparent hover:bg-white/10 border border-white/20 rounded-lg transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Copy Image Button */}
        <button
          onClick={handleCopy}
          title="फोटो क्लिपबोर्डमा कपी गर्नुहोस्"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-100 hover:text-white bg-brand-800/80 hover:bg-brand-800 border border-brand-700 rounded-lg transition-all active:scale-95"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>

        {/* Download PNG Button */}
        <button
          onClick={() => onDownload("png")}
          disabled={isDownloading}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 bg-gradient-to-r from-accent-orange to-orange-500 hover:from-orange-600 hover:to-orange-500 active:scale-95 text-white font-bold text-xs rounded-lg shadow-md shadow-accent-orange/30 transition-all disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isDownloading ? "तयार हुँदैछ..." : "Download PNG"}</span>
        </button>

        {/* User Profile & Account Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-brand-800/70 hover:bg-brand-800 border border-brand-700/80 text-white transition-all"
          >
            <div className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center text-white ${
              isAdmin ? "bg-amber-600 ring-2 ring-amber-400/50" : "bg-brand-500"
            }`}>
              {user?.username?.charAt(0).toUpperCase() || <User className="w-3.5 h-3.5" />}
            </div>
            <span className="text-xs font-semibold text-brand-100 hidden sm:inline max-w-[100px] truncate">
              {user?.fullName || user?.username || "Account"}
            </span>
            {isAdmin && (
              <span className="hidden md:inline text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded font-bold uppercase">
                Admin
              </span>
            )}
            <ChevronDown className="w-3 h-3 text-brand-300 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div
              className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-fade-in"
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 truncate">{user?.fullName || user?.username}</p>
                  <p className="text-[11px] text-slate-400">@{user?.username}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  isAdmin ? "bg-amber-100 text-amber-800 border border-amber-300" : "bg-blue-100 text-blue-800"
                }`}>
                  {user?.role || "user"}
                </span>
              </div>

              <div className="py-1">
                {isAdmin && onOpenUserManagement && (
                  <button
                    onClick={() => {
                      onOpenUserManagement();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-amber-900 hover:bg-amber-50 flex items-center gap-2.5"
                  >
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span>प्रयोगकर्ता व्यवस्थापन (User Management)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onOpenChangePassword();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-800 flex items-center gap-2.5"
                >
                  <KeyRound className="w-4 h-4 text-slate-400" />
                  <span>पासवर्ड परिवर्तन (Change Password)</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    onLogout();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>लगआउट गर्नुहोस् (Log Out)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

