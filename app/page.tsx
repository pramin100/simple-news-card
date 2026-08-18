"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SidebarControls from "@/components/SidebarControls";
import CanvasPreview from "@/components/CanvasPreview";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import AdminUsersModal from "@/components/AdminUsersModal";
import {
  CardState,
  DEFAULT_CARD_STATE,
  getDimensionsForRatio,
  renderNewsCardToCanvas,
} from "@/lib/canvasRenderer";
import { adToBs, formatNepaliDate } from "@/lib/nepaliDate";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function StudioPage() {
  const router = useRouter();

  // Auth state
  const [user, setUser] = useState<{
    id: string;
    username: string;
    fullName: string;
    role: string;
  } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Card Studio state
  const [cardState, setCardState] = useState<CardState>(() => {
    const bsDate = adToBs(new Date());
    const dateStr = formatNepaliDate(bsDate, 0);
    return {
      ...DEFAULT_CARD_STATE,
      dateText: dateStr,
    };
  });

  // Image objects for Canvas
  const [photoImage, setPhotoImage] = useState<HTMLImageElement | null>(null);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [adImage, setAdImage] = useState<HTMLImageElement | null>(null);

  // UI Modals & Notifications
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Fetch Auth State
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!data.user) {
          router.replace("/login");
          return;
        }
        setUser(data.user);
      } catch (err) {
        router.replace("/login");
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // State update handler
  const handleStateChange = (updates: Partial<CardState>) => {
    setCardState((prev) => ({ ...prev, ...updates }));
  };

  // Image upload helpers
  const handlePhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setPhotoImage(img);
        handleStateChange({ photoSrc: src, photoOffsetX: 0, photoOffsetY: 0 });
        showToast("फोटो सफलतापूर्वक लोड भयो!");
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setLogoImage(img);
        handleStateChange({ logoSrc: src });
        showToast("लोगो सफलतापूर्वक लोड भयो!");
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleAdUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setAdImage(img);
        handleStateChange({ adSrc: src, showAd: true });
        showToast("विज्ञापन फोटो लोड भयो!");
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Helper to load photo from URL using proxy to prevent CORS taint
  const handleLoadPhotoUrl = (url: string) => {
    const proxySrc = url.startsWith("data:") ? url : `/api/proxy-image?url=${encodeURIComponent(url)}`;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setPhotoImage(img);
      handleStateChange({ photoSrc: proxySrc, photoOffsetX: 0, photoOffsetY: 0 });
    };
    img.onerror = () => {
      // Fallback
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        setPhotoImage(fallbackImg);
        handleStateChange({ photoSrc: url, photoOffsetX: 0, photoOffsetY: 0 });
      };
      fallbackImg.src = url;
    };
    img.src = proxySrc;
  };

  // Helper to load logo from URL using proxy to prevent CORS taint
  const handleLoadLogoUrl = (url: string) => {
    const proxySrc = url.startsWith("data:") ? url : `/api/proxy-image?url=${encodeURIComponent(url)}`;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setLogoImage(img);
      handleStateChange({ logoSrc: proxySrc, showLogo: true });
    };
    img.onerror = () => {
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        setLogoImage(fallbackImg);
        handleStateChange({ logoSrc: url, showLogo: true });
      };
      fallbackImg.src = url;
    };
    img.src = proxySrc;
  };

  // Auto-fill from scraped news link
  const handleAutoFillNews = (data: {
    title: string;
    lead: string;
    photoUrl: string | null;
    logoUrl?: string | null;
    siteName: string;
    category: string;
    domain?: string;
    websiteUrl?: string;
    url?: string;
  }) => {
    const updates: Partial<CardState> = {};
    if (data.title) {
      updates.headline = data.title;
    }
    if (data.lead) {
      updates.leadText = data.lead;
      updates.showLead = true;
    }
    if (data.category) {
      updates.issueText = data.category;
      updates.showIssue = true;
    }

    // Always keep website URL in pure English (e.g. onlinekhabar.com, setopati.com, ratopati.com)
    let englishWebsite = "";
    if (data.websiteUrl) {
      englishWebsite = data.websiteUrl;
    } else if (data.domain) {
      englishWebsite = data.domain;
    } else if (data.url) {
      try {
        englishWebsite = new URL(data.url).hostname.replace(/^www\./, "").toLowerCase();
      } catch {
        // fallback
      }
    }

    if (!englishWebsite && data.siteName) {
      // Filter out Devanagari or any non-ASCII characters to guarantee English domain
      const asciiOnly = data.siteName.replace(/[^\x00-\x7F]/g, "").toLowerCase().replace(/\s+/g, "");
      if (asciiOnly) {
        englishWebsite = asciiOnly.includes(".") ? asciiOnly : `${asciiOnly}.com`;
      }
    }

    if (englishWebsite) {
      updates.ctaWebsite = englishWebsite.toLowerCase().trim();
      updates.showCta = true;
    }
    handleStateChange(updates);

    if (data.photoUrl) {
      handleLoadPhotoUrl(data.photoUrl);
    }
    if (data.logoUrl) {
      handleLoadLogoUrl(data.logoUrl);
    }
    showToast("समाचार विवरण र लोगो कार्डमा लोड भयो!");
  };

  // Reset to default
  const handleReset = () => {
    if (window.confirm("के तपाईं सबै सेटिङ फेरि सुरु गर्न चाहनुहुन्छ? (Reset all settings?)")) {
      const bsDate = adToBs(new Date());
      const dateStr = formatNepaliDate(bsDate, 0);
      setCardState({
        ...DEFAULT_CARD_STATE,
        dateText: dateStr,
      });
      setPhotoImage(null);
      setLogoImage(null);
      setAdImage(null);
      showToast("कार्ड रिसेट गरियो");
    }
  };

  // Apply Quick Theme Presets
  const handleApplyPreset = (preset: string) => {
    switch (preset) {
      case "breaking":
        handleStateChange({
          issueText: "ब्रेकिङ न्युज",
          issueColor: "#c0392b",
          issueTextColor: "#ffffff",
          headlineColor: "#8b0000",
          headlineHighlightColor: "#ff6b00",
          headlineBarColor: "#c0392b",
          dateBgColor: "#c0392b",
          panelBgColor: "#ffffff",
          panelTexture: "dots",
          topAccentBarColor: "#c0392b",
          bottomAccentBarColor: "#8b0000",
          showCta: true,
          ctaBgColor: "#8b0000",
          ctaTextColor: "#ffffff",
        });
        showToast("ब्रेकिङ न्युज थिम लागु भयो!");
        break;

      case "classic_blue":
        handleStateChange({
          issueText: "ताजा अपडेट",
          issueColor: "#1a6fad",
          issueTextColor: "#ffffff",
          headlineColor: "#0e2a42",
          headlineHighlightColor: "#1a6fad",
          headlineBarColor: "#1a6fad",
          dateBgColor: "#0e4f82",
          panelBgColor: "#ffffff",
          panelTexture: "grain",
          topAccentBarColor: "#1a6fad",
          bottomAccentBarColor: "#ff6b00",
          showCta: true,
          ctaBgColor: "#0e4f82",
          ctaTextColor: "#ffffff",
        });
        showToast("क्लासिक निलो थिम लागु भयो!");
        break;

      case "dark_edition":
        handleStateChange({
          issueText: "विशेष समाचार",
          issueColor: "#ff6b00",
          issueTextColor: "#ffffff",
          headlineColor: "#ffffff",
          headlineHighlightColor: "#FFD700",
          headlineBarColor: "#ff6b00",
          dateBgColor: "#1a6fad",
          panelBgColor: "#0e2a42",
          panelTexture: "vignette",
          leadColor: "#cbd5e1",
          topAccentBarColor: "#ff6b00",
          bottomAccentBarColor: "#1a6fad",
          showCta: true,
          ctaBgColor: "#163d63",
          ctaTextColor: "#ffffff",
        });
        showToast("डार्क मोड थिम लागु भयो!");
        break;

      case "gold_luxury":
        handleStateChange({
          issueText: "विशेष रिपोर्ट",
          issueColor: "#000000",
          issueTextColor: "#FFD700",
          headlineColor: "#1a1a1a",
          headlineHighlightColor: "#d97706",
          headlineBarColor: "#FFD700",
          dateBgColor: "#000000",
          panelBgColor: "#fffdfa",
          panelTexture: "linen",
          topAccentBarColor: "#FFD700",
          bottomAccentBarColor: "#000000",
          showCta: true,
          ctaBgColor: "#1a1a1a",
          ctaTextColor: "#FFD700",
        });
        showToast("गोल्ड लक्जरी थिम लागु भयो!");
        break;

      case "emerald":
        handleStateChange({
          issueText: "विचार / विश्लेषण",
          issueColor: "#10b981",
          issueTextColor: "#ffffff",
          headlineColor: "#064e3b",
          headlineHighlightColor: "#059669",
          headlineBarColor: "#10b981",
          dateBgColor: "#065f46",
          panelBgColor: "#ffffff",
          panelTexture: "dots",
          topAccentBarColor: "#10b981",
          bottomAccentBarColor: "#065f46",
          showCta: true,
          ctaBgColor: "#065f46",
          ctaTextColor: "#ffffff",
        });
        showToast("हरियो ताजा थिम लागु भयो!");
        break;
    }
  };

  // High-Resolution Download Handler
  const handleDownload = async (format: "png" | "jpeg" = "png") => {
    setIsDownloading(true);
    showToast("उच्च गुणस्तरको फोटो तयार हुँदैछ...");

    try {
      if (!offscreenCanvasRef.current) {
        offscreenCanvasRef.current = document.createElement("canvas");
      }
      const canvas = offscreenCanvasRef.current;

      await renderNewsCardToCanvas(canvas, cardState, {
        photo: photoImage || undefined,
        logo: logoImage || undefined,
        ad: adImage || undefined,
      });

      const mime = format === "jpeg" ? "image/jpeg" : "image/png";
      const quality = format === "jpeg" ? 0.95 : 1.0;
      const dataUrl = canvas.toDataURL(mime, quality);

      const link = document.createElement("a");
      const filename = `NewsCard_${Date.now()}.${format}`;
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast("कार्ड डाउनलोड भयो!");
    } catch (err) {
      console.error("Download error:", err);
      showToast("डाउनलोड गर्दा समस्या आयो");
    } finally {
      setIsDownloading(false);
    }
  };

  // Copy image to clipboard
  const handleCopyImage = async () => {
    try {
      if (!offscreenCanvasRef.current) {
        offscreenCanvasRef.current = document.createElement("canvas");
      }
      const canvas = offscreenCanvasRef.current;

      await renderNewsCardToCanvas(canvas, cardState, {
        photo: photoImage || undefined,
        logo: logoImage || undefined,
        ad: adImage || undefined,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              "image/png": blob,
            }),
          ]);
          showToast("फोटो क्लिपबोर्डमा कपी भयो!");
        } catch (clipErr) {
          showToast("क्लिपबोर्ड कपी सपोर्ट भएन, Download प्रयोग गर्नुहोस्");
        }
      }, "image/png");
    } catch (err) {
      showToast("कपी गर्न सकिएन");
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
    } catch {
      router.replace("/login");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white gap-3">
        <Loader2 className="w-8 h-8 text-accent-orange animate-spin" />
        <p className="text-sm font-semibold text-slate-300">स्टुडियो खुल्दैछ...</p>
      </div>
    );
  }

  return (
    <div className="h-screen min-h-screen flex flex-col bg-slate-100 overflow-hidden">
      {/* Top Header Navbar */}
      <Navbar
        user={user}
        onReset={handleReset}
        onDownload={handleDownload}
        onCopyImage={handleCopyImage}
        onOpenChangePassword={() => setIsPasswordModalOpen(true)}
        onOpenUserManagement={() => setIsUsersModalOpen(true)}
        onLogout={handleLogout}
        onApplyPreset={handleApplyPreset}
        isDownloading={isDownloading}
      />

      {/* Main Studio Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 h-[calc(100vh-3.5rem)]">
        {/* Left Sidebar Controls */}
        <SidebarControls
          state={cardState}
          onChange={handleStateChange}
          onPhotoUpload={handlePhotoUpload}
          onLogoUpload={handleLogoUpload}
          onAdUpload={handleAdUpload}
          onRemovePhoto={() => {
            setPhotoImage(null);
            handleStateChange({ photoSrc: null });
          }}
          onRemoveLogo={() => {
            setLogoImage(null);
            handleStateChange({ logoSrc: null });
          }}
          onRemoveAd={() => {
            setAdImage(null);
            handleStateChange({ adSrc: null, showAd: false });
          }}
          onAutoFillNews={handleAutoFillNews}
        />

        {/* Live Canvas Preview */}
        <CanvasPreview
          state={cardState}
          onChange={handleStateChange}
          photoImage={photoImage}
          logoImage={logoImage}
          adImage={adImage}
          onDownload={() => handleDownload("png")}
        />
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        username={user?.username || ""}
      />

      {/* Admin User Management Modal */}
      {user?.role === "admin" && (
        <AdminUsersModal
          isOpen={isUsersModalOpen}
          onClose={() => setIsUsersModalOpen(false)}
          currentUserId={user?.id}
          onToast={showToast}
        />
      )}

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[3000] bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700/80 text-xs font-semibold flex items-center gap-2 animate-bounce-short">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
