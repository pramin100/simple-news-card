"use client";

import React, { useRef, useState } from "react";
import {
  Upload,
  Image as ImageIcon,
  Type,
  Calendar,
  Sparkles,
  Layout,
  Megaphone,
  Palette,
  Eye,
  Sliders,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Layers,
  Tag,
  MessageSquare,
  Shield,
  Trash2,
  Link2,
  Globe,
  ClipboardPaste,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  FileText,
  X,
  Square,
} from "lucide-react";
import { CardState } from "@/lib/canvasRenderer";
import { NEPALI_DATE_FORMAT_OPTIONS, adToBs, formatNepaliDate } from "@/lib/nepaliDate";

interface SidebarControlsProps {
  state: CardState;
  onChange: (newState: Partial<CardState>) => void;
  onPhotoUpload: (file: File) => void;
  onLogoUpload: (file: File) => void;
  onAdUpload: (file: File) => void;
  onRemovePhoto: () => void;
  onRemoveLogo: () => void;
  onRemoveAd: () => void;
  onAutoFillNews?: (data: {
    title: string;
    lead: string;
    photoUrl: string | null;
    logoUrl?: string | null;
    siteName: string;
    category: string;
    domain?: string;
    websiteUrl?: string;
    url?: string;
  }) => void;
}

const FONTS_LIST = [
  { name: "Noto Serif Devanagari", label: "Noto Serif", sample: "ट्र क्ष" },
  { name: "Mukta", label: "Mukta", sample: "ट्र क्ष" },
  { name: "Baloo 2", label: "Baloo 2", sample: "ट्र क्ष" },
  { name: "Hind", label: "Hind", sample: "ट्र क्ष" },
  { name: "Khand", label: "Khand", sample: "ट्र क्ष" },
  { name: "Anek Devanagari", label: "Anek Devanagari", sample: "ट्र क्ष" },
  { name: "Teko", label: "Teko", sample: "ट्र क्ष" },
  { name: "Rozha One", label: "Rozha One", sample: "ट्र क्ष" },
  { name: "Yatra One", label: "Yatra One", sample: "ट्र क्ष" },
];

const COLOR_SWATCHES = [
  "#8b0000",
  "#c0392b",
  "#0e2a42",
  "#1a6fad",
  "#000000",
  "#ffffff",
  "#ff6b00",
  "#FFD700",
  "#1a3a1a",
  "#2a1a40",
  "#334155",
  "#e2e8f0",
];

const PHOTO_EFFECTS = [
  { id: "none", label: "None" },
  { id: "bw", label: "B&W" },
  { id: "sepia", label: "Sepia" },
  { id: "vivid", label: "Vivid" },
  { id: "dark", label: "Dark" },
  { id: "warm", label: "Warm" },
  { id: "cool", label: "Cool" },
  { id: "cine", label: "Cinematic" },
  { id: "vintage", label: "Vintage" },
  { id: "hicon", label: "Hi-Contrast" },
  { id: "noir", label: "Noir" },
];

const PANEL_TEXTURES = [
  { id: "none", label: "None", icon: "🚫" },
  { id: "dots", label: "Dots", icon: "⚬⚬" },
  { id: "grain", label: "Fine Grain", icon: "▪️░" },
  { id: "vignette", label: "Vignette", icon: "◐" },
  { id: "halftone", label: "Halftone", icon: "●∘" },
  { id: "paper", label: "Paper", icon: "📜" },
  { id: "spotlight", label: "Spotlight", icon: "◔" },
  { id: "linen", label: "Linen", icon: "▦" },
];

export default function SidebarControls({
  state,
  onChange,
  onPhotoUpload,
  onLogoUpload,
  onAdUpload,
  onRemovePhoto,
  onRemoveLogo,
  onRemoveAd,
  onAutoFillNews,
}: SidebarControlsProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const adInputRef = useRef<HTMLInputElement>(null);

  // News URL Auto Fetch State
  const [newsUrl, setNewsUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [lastExtracted, setLastExtracted] = useState<{
    title: string;
    lead: string;
    photoUrl: string | null;
    logoUrl?: string | null;
    siteName: string;
    category: string;
  } | null>(null);

  const handleStep = (key: keyof CardState, step: number, min: number, max: number) => {
    const current = (state[key] as number) || 0;
    const next = Math.max(min, Math.min(max, current + step));
    onChange({ [key]: next });
  };

  const handleDateFormatChange = (index: number) => {
    const bsDate = adToBs(new Date());
    const formatted = formatNepaliDate(bsDate, index);
    onChange({
      dateFormatIndex: index,
      dateText: formatted,
    });
  };

  const handleFetchNews = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newsUrl.trim()) {
      setExtractError("कृपया समाचारको लिङ्क हाल्नुहोस् (Enter a URL)");
      return;
    }

    setIsExtracting(true);
    setExtractError(null);

    try {
      const res = await fetch("/api/extract-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newsUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "समाचार लिङ्कबाट विवरण निकाल्न सकिएन");
      }

      setLastExtracted(data.data);
      if (onAutoFillNews) {
        onAutoFillNews(data.data);
      }
    } catch (err: any) {
      setExtractError(err.message || "लिङ्क फेच गर्दा समस्या आयो");
    } finally {
      setIsExtracting(false);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setNewsUrl(text);
        setExtractError(null);
      }
    } catch {
      // clipboard access denied
    }
  };

  return (
    <aside className="w-full lg:w-[380px] xl:w-[410px] flex-shrink-0 bg-white border-r border-slate-200 overflow-y-auto h-full min-h-[calc(100vh-3.5rem)] lg:min-h-0 lg:h-full text-slate-800 p-4 space-y-6 select-none shadow-sm">
      {/* 🚀 Feature: Auto Fetch from News Link */}
      <div className="p-3.5 bg-gradient-to-br from-brand-900 to-slate-900 rounded-2xl text-white shadow-md border border-brand-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-accent-orange/20 border border-accent-orange/40 flex items-center justify-center text-accent-orange">
              <Link2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide">
              समाचार लिङ्कबाट अटो-फेच (URL Auto-Fill)
            </span>
          </div>
          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded-full font-bold uppercase">
            Auto AI
          </span>
        </div>

        <form onSubmit={handleFetchNews} className="space-y-2">
          <div className="relative flex items-center">
            <input
              type="text"
              value={newsUrl}
              onChange={(e) => {
                setNewsUrl(e.target.value);
                setExtractError(null);
              }}
              placeholder=""
              className="w-full pl-8 pr-16 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-400 outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange"
            />
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
            <button
              type="button"
              onClick={handlePasteClipboard}
              title="क्लिपबोर्डबाट पेस्ट गर्नुहोस्"
              className="absolute right-1.5 px-2 py-1 bg-slate-700 hover:bg-slate-600 active:scale-95 text-[10px] font-semibold text-slate-200 rounded-lg flex items-center gap-1 transition-all"
            >
              <ClipboardPaste className="w-3 h-3" />
              <span>Paste</span>
            </button>
          </div>

          {extractError && (
            <div className="p-2 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-[11px] flex items-start gap-1.5 animate-fade-in">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{extractError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isExtracting || !newsUrl.trim()}
            className="w-full py-2 bg-gradient-to-r from-accent-orange to-orange-500 hover:from-orange-600 hover:to-orange-500 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md shadow-accent-orange/30 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>समाचार विवरण फेच हुँदैछ...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>समाचार विवरण फेच गर्नुहोस् (Extract & Fill)</span>
              </>
            )}
          </button>
        </form>

        {/* Last extracted summary badge */}
        {lastExtracted && (
          <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/80 text-[11px] space-y-1.5 animate-fade-in">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                सफलतापूर्वक लोड भयो ({lastExtracted.siteName || "News Site"})
              </span>
              <button
                onClick={() => setLastExtracted(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-slate-200 font-medium truncate">
              {lastExtracted.title}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/50">
              {lastExtracted.photoUrl && (
                <div className="flex items-center gap-1.5 p-1 bg-slate-900/60 rounded-lg border border-slate-700/60">
                  <img
                    src={
                      lastExtracted.photoUrl.startsWith("data:")
                        ? lastExtracted.photoUrl
                        : `/api/proxy-image?url=${encodeURIComponent(lastExtracted.photoUrl)}`
                    }
                    alt="Photo"
                    className="w-8 h-8 object-cover rounded bg-slate-950 flex-shrink-0"
                  />
                  <div className="text-[10px] leading-tight">
                    <span className="text-emerald-400 font-bold block">फोटो ✓</span>
                    <span className="text-slate-400 text-[9px]">Photo loaded</span>
                  </div>
                </div>
              )}
              {lastExtracted.logoUrl && (
                <div className="flex items-center gap-1.5 p-1 bg-slate-900/60 rounded-lg border border-slate-700/60">
                  <img
                    src={
                      lastExtracted.logoUrl.startsWith("data:")
                        ? lastExtracted.logoUrl
                        : `/api/proxy-image?url=${encodeURIComponent(lastExtracted.logoUrl)}`
                    }
                    alt="Logo"
                    className="w-8 h-8 object-contain p-0.5 rounded bg-white flex-shrink-0"
                  />
                  <div className="text-[10px] leading-tight">
                    <span className="text-amber-400 font-bold block">लोगो ✓</span>
                    <span className="text-slate-400 text-[9px]">Logo loaded</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 0. Aspect Ratio / Size Picker */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-brand-800" />
          <span>कार्ड साइज (Aspect Ratio)</span>
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: "4:5", label: "4:5 Portrait", sub: "1080×1350 (FB/Insta)" },
            { id: "1:1", label: "1:1 Square", sub: "1080×1080" },
            { id: "16:9", label: "16:9 Link", sub: "1200×675" },
            { id: "9:16", label: "9:16 Story", sub: "1080×1920" },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => onChange({ aspectRatio: r.id as any })}
              className={`p-2 rounded-xl text-center border transition-all text-xs font-semibold ${
                state.aspectRatio === r.id
                  ? "bg-brand-900 text-white border-brand-900 shadow-md shadow-brand-900/20"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className="text-[11px]">{r.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 0.1 Card Border Corners Option (Sharp vs Rounded) */}
      <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Square className="w-3.5 h-3.5 text-brand-800" />
            <span>कार्डको कुना (Card Corners)</span>
          </label>
          <span className="text-[10px] font-mono font-bold text-brand-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
            {(state.cardBorderRadius || 0) === 0 ? "सिधा (0px)" : `${state.cardBorderRadius}px`}
          </span>
        </div>

        {/* Quick Corner Preset Buttons */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => onChange({ cardBorderRadius: 0 })}
            className={`py-1.5 px-2 text-[11px] font-semibold rounded-xl border transition-all flex items-center justify-center gap-1 ${
              (state.cardBorderRadius || 0) === 0
                ? "bg-brand-900 text-white border-brand-900 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <span>📐 सिधा (Sharp)</span>
          </button>
          <button
            type="button"
            onClick={() => onChange({ cardBorderRadius: 24 })}
            className={`py-1.5 px-2 text-[11px] font-semibold rounded-xl border transition-all flex items-center justify-center gap-1 ${
              state.cardBorderRadius === 24
                ? "bg-brand-900 text-white border-brand-900 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <span>🔲 हल्का गोलो</span>
          </button>
          <button
            type="button"
            onClick={() => onChange({ cardBorderRadius: 48 })}
            className={`py-1.5 px-2 text-[11px] font-semibold rounded-xl border transition-all flex items-center justify-center gap-1 ${
              state.cardBorderRadius === 48
                ? "bg-brand-900 text-white border-brand-900 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <span>🔘 धेरै गोलो</span>
          </button>
        </div>

        {/* Custom Corner Radius Slider */}
        <div className="space-y-1 pt-0.5">
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>कस्टम गोलोपन (Custom Radius)</span>
            <span>{state.cardBorderRadius || 0}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={64}
            step={2}
            value={state.cardBorderRadius || 0}
            onChange={(e) => onChange({ cardBorderRadius: parseInt(e.target.value) || 0 })}
            className="w-full h-1 bg-slate-200 rounded cursor-pointer accent-brand-800"
          />
        </div>
      </div>

      <hr className="border-slate-150" />

      {/* 1. Headline Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-brand-900 text-white text-[10px] flex items-center justify-center font-bold">
              1
            </span>
            <span>हेडलाइन (Title) *</span>
          </label>
        </div>

        <textarea
          value={state.headline}
          onChange={(e) => onChange({ headline: e.target.value })}
          rows={3}
          placeholder="समाचारको शीर्षक यहाँ लेख्नुहोस्..."
          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition-all resize-y"
          style={{ fontFamily: state.headlineFont }}
        />
        <p className="text-[11px] text-slate-400">
          💡 Enter थिच्दा त्यहीँबाट नयाँ लाइन सुरु हुन्छ (जस्तो टाइप गर्नुभयो उस्तै देखिन्छ)।
        </p>

        {/* Font Size Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>फन्ट साइज (Font Size)</span>
            <span className="font-bold text-brand-800">{state.headlineFontSize}px</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStep("headlineFontSize", -2, 28, 96)}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min={28}
              max={96}
              value={state.headlineFontSize}
              onChange={(e) => onChange({ headlineFontSize: parseInt(e.target.value) })}
              className="flex-1 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <button
              onClick={() => handleStep("headlineFontSize", 2, 28, 96)}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Font Selection Grid */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold text-slate-700">हेडलाइन फन्ट (Typography)</label>
          <div className="grid grid-cols-3 gap-1.5">
            {FONTS_LIST.map((font) => (
              <button
                key={font.name}
                onClick={() => onChange({ headlineFont: font.name })}
                className={`p-2 rounded-xl border text-center transition-all ${
                  state.headlineFont === font.name
                    ? "border-brand-700 bg-brand-50 text-brand-900 ring-2 ring-brand-500/20"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                }`}
              >
                <span className="text-sm font-bold block" style={{ fontFamily: font.name }}>
                  {font.sample}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">{font.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Headline Color Swatches */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span className="font-semibold">हेडलाइन रंग</span>
            <span className="text-[11px] font-mono text-slate-400">{state.headlineColor}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_SWATCHES.map((c) => (
              <button
                key={c}
                onClick={() => onChange({ headlineColor: c })}
                style={{ backgroundColor: c }}
                className={`w-7 h-7 rounded-lg shadow-xs border transition-transform hover:scale-110 ${
                  state.headlineColor === c ? "ring-2 ring-offset-2 ring-brand-800" : "border-slate-300"
                }`}
              />
            ))}
            <label className="w-7 h-7 rounded-lg border border-slate-300 overflow-hidden cursor-pointer flex items-center justify-center bg-gradient-to-tr from-rose-500 via-amber-400 to-sky-500 hover:scale-110 transition-transform">
              <input
                type="color"
                value={state.headlineColor}
                onChange={(e) => onChange({ headlineColor: e.target.value })}
                className="opacity-0 w-0 h-0"
              />
            </label>
          </div>
        </div>

        {/* Highlight Word Section */}
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <span>✍️ शब्द हाइलाइट (Highlight Word)</span>
          </div>
          <p className="text-[11px] text-amber-800/80 leading-relaxed">
            हेडलाइनमा जुन शब्द highlight गर्ने हो, त्यसलाई <b>*तारा चिन्ह*</b> बीचमा राख्नुहोस् — जस्तै:{" "}
            <i>शिक्षा क्षेत्रमा *दीनबन्धु गोयल* को ठूलो सहयोग</i>
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-amber-900">हाइलाइट रंग:</span>
            <div className="flex items-center gap-1.5">
              {["#ff6b00", "#FFD700", "#c0392b", "#1a6fad", "#10b981", "#ffffff"].map((c) => (
                <button
                  key={c}
                  onClick={() => onChange({ headlineHighlightColor: c })}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-md border transition-transform ${
                    state.headlineHighlightColor === c
                      ? "ring-2 ring-offset-1 ring-amber-600"
                      : "border-slate-300"
                  }`}
                />
              ))}
              <input
                type="color"
                value={state.headlineHighlightColor}
                onChange={(e) => onChange({ headlineHighlightColor: e.target.value })}
                className="w-6 h-6 rounded-md cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Text Fine Alignment and Position Offsets */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>X (←→) Offset</span>
              <span>{state.headlineOffsetX}px</span>
            </div>
            <input
              type="range"
              min={-150}
              max={150}
              value={state.headlineOffsetX}
              onChange={(e) => onChange({ headlineOffsetX: parseInt(e.target.value) })}
              className="w-full h-1 bg-slate-200 rounded cursor-pointer"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Y (↑↓) Offset</span>
              <span>{state.headlineOffsetY}px</span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={state.headlineOffsetY}
              onChange={(e) => onChange({ headlineOffsetY: parseInt(e.target.value) })}
              className="w-full h-1 bg-slate-200 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Headline Accent Bar Toggle */}
        <div className="flex items-center justify-between pt-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.showHeadlineBar}
              onChange={(e) => onChange({ showHeadlineBar: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <span>हेडलाइन साइड बार देखाउने (Accent Bar)</span>
          </label>
          {state.showHeadlineBar && (
            <input
              type="color"
              value={state.headlineBarColor}
              onChange={(e) => onChange({ headlineBarColor: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer"
            />
          )}
        </div>
      </div>

      <hr className="border-slate-150" />

      {/* 2. Lead Line / Summary Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-brand-900 text-white text-[10px] flex items-center justify-center font-bold">
              2
            </span>
            <span>लिड लाइन / विवरण (Lead Content)</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
            <input
              type="checkbox"
              checked={state.showLead}
              onChange={(e) => onChange({ showLead: e.target.checked })}
              className="w-3.5 h-3.5 rounded text-brand-600"
            />
            <span>सक्रिय</span>
          </label>
        </div>

        {state.showLead && (
          <>
            <textarea
              value={state.leadText}
              onChange={(e) => onChange({ leadText: e.target.value })}
              rows={2}
              placeholder="समाचारको संक्षिप्त विवरण यहाँ लेख्नुहोस् (२-३ लाइन)..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
            />
            <div className="grid grid-cols-2 gap-3 items-center">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>साइज</span>
                  <span className="font-bold">{state.leadFontSize}px</span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={42}
                  value={state.leadFontSize}
                  onChange={(e) => onChange({ leadFontSize: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-200 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <span className="text-[11px] text-slate-500">रंग:</span>
                <input
                  type="color"
                  value={state.leadColor}
                  onChange={(e) => onChange({ leadColor: e.target.value })}
                  className="w-7 h-7 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </>
        )}
      </div>

      <hr className="border-slate-150" />

      {/* 3. Featured Photo Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-brand-900 text-white text-[10px] flex items-center justify-center font-bold">
              3
            </span>
            <span>फोटो (Featured Photo)</span>
          </label>
          {state.photoSrc && (
            <button
              onClick={onRemovePhoto}
              className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3 h-3" />
              <span>हटाउनुस्</span>
            </button>
          )}
        </div>

        {/* Upload Dropzone */}
        <div
          onClick={() => photoInputRef.current?.click()}
          className="p-4 border-2 border-dashed border-slate-300 hover:border-brand-600 bg-slate-50 hover:bg-brand-50/50 rounded-2xl cursor-pointer text-center transition-all group"
        >
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) onPhotoUpload(e.target.files[0]);
            }}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-1.5">
            <div className="p-2.5 rounded-full bg-brand-100 text-brand-800 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-700">
              {state.photoSrc ? "अर्को फोटो छान्नुहोस्" : "📷 फोटो अपलोड गर्नुहोस्"}
            </p>
            <p className="text-[11px] text-slate-400">ट्याप गर्नुहोस् वा फाइल तान्नुहोस्</p>
          </div>
        </div>

        {/* Controls when photo is loaded */}
        <div className="space-y-2.5 pt-1">
          {/* Zoom */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Zoom</span>
              <span className="font-bold text-brand-800">{state.photoZoom}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStep("photoZoom", -5, 40, 300)}
                className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-xs font-bold flex items-center justify-center"
              >
                −
              </button>
              <input
                type="range"
                min={40}
                max={300}
                value={state.photoZoom}
                onChange={(e) => onChange({ photoZoom: parseInt(e.target.value) })}
                className="flex-1 h-1 bg-slate-200 rounded cursor-pointer"
              />
              <button
                onClick={() => handleStep("photoZoom", 5, 40, 300)}
                className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-xs font-bold flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Pan X / Y Offsets */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Pan X</span>
                <span>{state.photoOffsetX}</span>
              </div>
              <input
                type="range"
                min={-600}
                max={600}
                value={state.photoOffsetX}
                onChange={(e) => onChange({ photoOffsetX: parseInt(e.target.value) })}
                className="w-full h-1 bg-slate-200 rounded cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Pan Y</span>
                <span>{state.photoOffsetY}</span>
              </div>
              <input
                type="range"
                min={-600}
                max={600}
                value={state.photoOffsetY}
                onChange={(e) => onChange({ photoOffsetY: parseInt(e.target.value) })}
                className="w-full h-1 bg-slate-200 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Brightness */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>उज्यालो (Brightness)</span>
              <span>{state.photoBrightness}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={180}
              value={state.photoBrightness}
              onChange={(e) => onChange({ photoBrightness: parseInt(e.target.value) })}
              className="w-full h-1 bg-slate-200 rounded cursor-pointer"
            />
          </div>

          {/* Photo Filters / Effects Grid */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-slate-700">फोटो इफेक्ट (Photo Effect)</label>
            <div className="grid grid-cols-4 gap-1">
              {PHOTO_EFFECTS.map((fx) => (
                <button
                  key={fx.id}
                  onClick={() => onChange({ photoEffect: fx.id as any })}
                  className={`px-1.5 py-1.5 rounded-lg text-[11px] font-medium border text-center transition-all ${
                    state.photoEffect === fx.id
                      ? "bg-brand-800 text-white border-brand-800 shadow-xs font-bold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {fx.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            💡 फोटोमाथि माउस वा औंलाले सिधै तानेर (Drag) पनि पोजिसन मिलाउन मिल्छ।
          </p>
        </div>
      </div>

      <hr className="border-slate-150" />

      {/* 4. Nepali Date Section (Bikram Sambat) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-brand-800" />
            <span>नेपाली मिति (Date Container)</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
            <input
              type="checkbox"
              checked={state.showDate}
              onChange={(e) => onChange({ showDate: e.target.checked })}
              className="w-3.5 h-3.5 rounded text-brand-600"
            />
            <span>देखाउने</span>
          </label>
        </div>

        {state.showDate && (
          <div className="space-y-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            {/* Date Container Style Picker */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 block">
                कन्टेनर डिजाइन (Container Style)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "pill", label: "आधुनिक पिल (Modern Pill)", icon: "💊" },
                  { id: "glass", label: "ग्लास मोड (Frosted Glass)", icon: "✨" },
                  { id: "minimal", label: "आउटलाइन (Minimal Ghost)", icon: "▢" },
                  { id: "badge", label: "राउन्ड ब्याज (Square Badge)", icon: "🏷️" },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => onChange({ dateStyle: st.id as any })}
                    className={`p-2 rounded-xl text-left border transition-all text-xs font-semibold flex items-center gap-1.5 ${
                      (state.dateStyle || "pill") === st.id
                        ? "bg-brand-900 text-white border-brand-900 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{st.icon}</span>
                    <span className="truncate text-[11px]">{st.label.split(" (")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Icon Toggle */}
            <div className="flex items-center justify-between py-1 border-t border-b border-slate-200/70">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>क्यालेन्डर आइकन (Calendar Icon)</span>
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.showDateIcon !== false}
                  onChange={(e) => onChange({ showDateIcon: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-brand-700"></div>
              </label>
            </div>

            {/* Date Format Selector */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Date Format छान्नुहोस्</label>
              <select
                value={state.dateFormatIndex}
                onChange={(e) => handleDateFormatChange(parseInt(e.target.value))}
                className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:border-brand-600 font-medium"
              >
                {NEPALI_DATE_FORMAT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Manual Text Input */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">मिति (चाहे हातैले सम्पादन गर्नुहोस्)</label>
              <input
                type="text"
                value={state.dateText}
                onChange={(e) => onChange({ dateText: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:border-brand-600"
              />
            </div>

            {/* Date Font Size */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>अक्षर साइज (Date Font Size)</span>
                <span className="font-bold text-brand-900">{state.dateFontSize || 24}px</span>
              </div>
              <input
                type="range"
                min={16}
                max={36}
                step={1}
                value={state.dateFontSize || 24}
                onChange={(e) => onChange({ dateFontSize: parseInt(e.target.value) || 24 })}
                className="w-full h-1 bg-slate-200 rounded cursor-pointer accent-brand-800"
              />
            </div>

            {/* Date Color Swatches */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-slate-700">कन्टेनर रंग (Color):</span>
              <div className="flex items-center gap-1.5">
                {["#1a6fad", "#0e4f82", "#c0392b", "#ff6b00", "#000000", "#10b981"].map((c) => (
                  <button
                    key={c}
                    onClick={() => onChange({ dateBgColor: c })}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-md border transition-transform ${
                      state.dateBgColor === c ? "ring-2 ring-offset-1 ring-brand-800" : "border-slate-300"
                    }`}
                  />
                ))}
                <input
                  type="color"
                  value={state.dateBgColor}
                  onChange={(e) => onChange({ dateBgColor: e.target.value })}
                  className="w-6 h-6 rounded-md cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <hr className="border-slate-150" />

      {/* 5. Issue / Category Tag */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-brand-800" />
            <span>विधा / ट्याग (Category Badge)</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
            <input
              type="checkbox"
              checked={state.showIssue}
              onChange={(e) => onChange({ showIssue: e.target.checked })}
              className="w-3.5 h-3.5 rounded text-brand-600"
            />
            <span>सक्रिय</span>
          </label>
        </div>

        {state.showIssue && (
          <div className="space-y-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <input
              type="text"
              value={state.issueText}
              onChange={(e) => onChange({ issueText: e.target.value })}
              placeholder="जस्तै: ताजा अपडेट, ब्रेकिङ, खेलकुद, विचार"
              className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium outline-none focus:border-brand-600"
            />

            {/* Live Dot Toggle */}
            <div className="flex items-center justify-between py-1 border-t border-b border-slate-200/70">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>लाइभ स्टेटस डट (Live Dot)</span>
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.showIssueDot !== false}
                  onChange={(e) => onChange({ showIssueDot: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-brand-700"></div>
              </label>
            </div>

            {/* Category Badge Font Size */}
            <div className="space-y-1 pt-0.5">
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>अक्षर साइज (Category Font Size)</span>
                <span className="font-bold text-brand-900">{state.issueFontSize || 26}px</span>
              </div>
              <input
                type="range"
                min={18}
                max={38}
                step={1}
                value={state.issueFontSize || 26}
                onChange={(e) => onChange({ issueFontSize: parseInt(e.target.value) || 26 })}
                className="w-full h-1 bg-slate-200 rounded cursor-pointer accent-brand-800"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-slate-700">ट्याग रंग:</span>
              <div className="flex items-center gap-1.5">
                {["#c0392b", "#8b0000", "#1a6fad", "#ff6b00", "#000000", "#10b981"].map((c) => (
                  <button
                    key={c}
                    onClick={() => onChange({ issueColor: c })}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-md border transition-transform ${
                      state.issueColor === c ? "ring-2 ring-offset-1 ring-brand-800" : "border-slate-300"
                    }`}
                  />
                ))}
                <input
                  type="color"
                  value={state.issueColor}
                  onChange={(e) => onChange({ issueColor: e.target.value })}
                  className="w-6 h-6 rounded-md cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <hr className="border-slate-150" />

      {/* 6. Company Logo Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-brand-800" />
            <span>कम्पनी लोगो (Company Logo)</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
            <input
              type="checkbox"
              checked={state.showLogo}
              onChange={(e) => onChange({ showLogo: e.target.checked })}
              className="w-3.5 h-3.5 rounded text-brand-600"
            />
            <span>देखाउने</span>
          </label>
        </div>

        {state.showLogo && (
          <>
            <div
              onClick={() => logoInputRef.current?.click()}
              className="p-3 border-2 border-dashed border-slate-300 hover:border-brand-600 bg-slate-50 rounded-xl cursor-pointer text-center text-xs font-semibold text-slate-700"
            >
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) onLogoUpload(e.target.files[0]);
                }}
                className="hidden"
              />
              {state.logoSrc ? "🔄 अर्को लोगो अपलोड गर्नुहोस्" : "🛡️ आफ्नो लोगो अपलोड गर्नुहोस्"}
            </div>

            {/* Logo Shape Toggle */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-semibold text-slate-700">लोगो आकार (Shape)</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "circle", label: "गोलो (Circle)" },
                  { id: "rounded", label: "राउन्ड (Square)" },
                  { id: "square", label: "सिधा (Box)" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onChange({ logoShape: s.id as any })}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      (state.logoShape || "circle") === s.id
                        ? "bg-brand-900 text-white border-brand-900 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>लोगो साइज</span>
                  <span className="font-bold text-brand-900">{state.logoHeight || 110}px</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={180}
                  step={2}
                  value={state.logoHeight || 110}
                  onChange={(e) => onChange({ logoHeight: parseInt(e.target.value) || 110 })}
                  className="w-full h-1 bg-slate-200 rounded cursor-pointer accent-brand-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 block">स्थान (Position)</label>
                <select
                  value={state.logoPosition || "bottom-center"}
                  onChange={(e) => onChange({ logoPosition: e.target.value as any })}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                >
                  <option value="bottom-center">फोटोको तल बीचमा (Bottom Center)</option>
                  <option value="bottom-left">फोटोको तल बायाँ (Bottom Left)</option>
                  <option value="bottom-right">फोटोको तल दायाँ (Bottom Right)</option>
                  <option value="top-left">माथि बायाँ (Top Left)</option>
                  <option value="top-center">माथि बीचमा (Top Center)</option>
                  <option value="top-right">माथि दायाँ (Top Right)</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      <hr className="border-slate-150" />

      {/* 7. Advertisement Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5 text-accent-orange" />
            <span>📢 विज्ञापन (Ad Photo)</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
            <input
              type="checkbox"
              checked={state.showAd}
              onChange={(e) => onChange({ showAd: e.target.checked })}
              className="w-3.5 h-3.5 rounded text-brand-600"
            />
            <span>Ad देखाउने</span>
          </label>
        </div>

        {state.showAd && (
          <div className="space-y-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-[11px] text-slate-500">
              फोटो/प्यानल साइज त्यस्तै रहन्छ — Ad ले आफ्नो अनुपात अनुसार सुरक्षित स्थान लिन्छ।
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChange({ adPosition: "footer" })}
                className={`p-1.5 rounded-lg text-xs font-semibold border ${
                  state.adPosition === "footer"
                    ? "bg-brand-800 text-white border-brand-800"
                    : "bg-white text-slate-700 border-slate-200"
                }`}
              >
                तल (Footer)
              </button>
              <button
                onClick={() => onChange({ adPosition: "above" })}
                className={`p-1.5 rounded-lg text-xs font-semibold border ${
                  state.adPosition === "above"
                    ? "bg-brand-800 text-white border-brand-800"
                    : "bg-white text-slate-700 border-slate-200"
                }`}
              >
                Panel माथि
              </button>
            </div>

            <div
              onClick={() => adInputRef.current?.click()}
              className="p-3 border-2 border-dashed border-slate-300 hover:border-brand-600 bg-white rounded-xl cursor-pointer text-center text-xs font-semibold text-slate-700"
            >
              <input
                ref={adInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) onAdUpload(e.target.files[0]);
                }}
                className="hidden"
              />
              {state.adSrc ? "📢 अर्को Ad फोटो छान्नुहोस्" : "📢 Ad फोटो अपलोड गर्नुहोस्"}
            </div>

            {state.adSrc && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Ad अग्लाइ (Height)</span>
                  <span className="font-bold">{state.adHeight}px</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={175}
                  value={state.adHeight}
                  onChange={(e) => onChange({ adHeight: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-200 rounded cursor-pointer"
                />
                <button
                  onClick={onRemoveAd}
                  className="w-full py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg font-semibold"
                >
                  🗑️ Ad हटाउनुहोस्
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <hr className="border-slate-150" />

      {/* 8. Panel Background & Textures */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-brand-800" />
          <span>🎨 Panel रंग र Texture</span>
        </label>

        {/* Panel Color */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span>Panel रंग (तल)</span>
            <span className="text-[11px] font-mono text-slate-400">{state.panelBgColor}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["#ffffff", "#f8fafc", "#0e2a42", "#1a6fad", "#000000", "#7b1a1a", "#c0392b", "#1a3a1a"].map(
              (c) => (
                <button
                  key={c}
                  onClick={() => onChange({ panelBgColor: c })}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-lg border transition-transform hover:scale-110 ${
                    state.panelBgColor === c ? "ring-2 ring-offset-2 ring-brand-800" : "border-slate-300"
                  }`}
                />
              )
            )}
            <input
              type="color"
              value={state.panelBgColor}
              onChange={(e) => onChange({ panelBgColor: e.target.value })}
              className="w-7 h-7 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Textures Grid */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold text-slate-700">✨ Texture Effect</label>
          <div className="grid grid-cols-4 gap-1">
            {PANEL_TEXTURES.map((tex) => (
              <button
                key={tex.id}
                onClick={() => onChange({ panelTexture: tex.id as any })}
                className={`p-1.5 rounded-lg text-[11px] font-medium border text-center transition-all ${
                  state.panelTexture === tex.id
                    ? "bg-brand-800 text-white border-brand-800 shadow-xs font-bold"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="text-sm">{tex.icon}</div>
                <div className="truncate">{tex.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Texture Intensity */}
        {state.panelTexture !== "none" && (
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Texture बाक्लोपन (Opacity)</span>
              <span>{Math.round(state.panelTextureOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={4}
              max={40}
              value={Math.round(state.panelTextureOpacity * 100)}
              onChange={(e) => onChange({ panelTextureOpacity: parseInt(e.target.value) / 100 })}
              className="w-full h-1 bg-slate-200 rounded cursor-pointer"
            />
          </div>
        )}
      </div>

      <hr className="border-slate-150" />

      {/* 9. CTA Bottom Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-brand-800" />
            <span>CTA वाक्य र वेबसाइट (Call To Action)</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
            <input
              type="checkbox"
              checked={state.showCta !== false}
              onChange={(e) => onChange({ showCta: e.target.checked })}
              className="w-3.5 h-3.5 rounded text-brand-600"
            />
            <span>देखाउने</span>
          </label>
        </div>

        {state.showCta !== false && (
          <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            {/* Quick Slogans */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600">तयारी CTA वाक्यहरू (Quick Slogans):</label>
              <div className="flex flex-wrap gap-1">
                {[
                  "विस्तृत समाचार कमेन्टमा",
                  "थप जानकारी प्रोफाइल लिङ्कमा",
                  "पूरा भिडियो युट्युबमा",
                  "ताजा अपडेटका लागि फलो गर्नुहोस्",
                ].map((slogan) => (
                  <button
                    key={slogan}
                    type="button"
                    onClick={() => onChange({ ctaText: slogan })}
                    className={`px-2 py-1 text-[10px] font-medium rounded-lg border transition-all ${
                      state.ctaText === slogan
                        ? "bg-brand-800 text-white border-brand-800 font-bold"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {slogan}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">CTA वाक्य (Slogan Text)</label>
              <input
                type="text"
                value={state.ctaText ?? "विस्तृत समाचार कमेन्टमा"}
                onChange={(e) => onChange({ ctaText: e.target.value })}
                placeholder="जस्तै: विस्तृत समाचार कमेन्टमा"
                className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs outline-none font-medium text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">वेबसाइट / सोसल प्रोफाइल (Website URL)</label>
              <input
                type="text"
                value={state.ctaWebsite ?? "www.manavaawaj.com"}
                onChange={(e) => onChange({ ctaWebsite: e.target.value })}
                placeholder="www.manavaawaj.com"
                className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs outline-none font-mono text-slate-800"
              />
            </div>

            {/* CTA Font Size */}
            <div className="space-y-1 pt-0.5">
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>अक्षर साइज (CTA Font Size)</span>
                <span className="font-bold text-brand-900">{state.ctaFontSize || 26}px</span>
              </div>
              <input
                type="range"
                min={18}
                max={38}
                step={1}
                value={state.ctaFontSize || 26}
                onChange={(e) => onChange({ ctaFontSize: parseInt(e.target.value) || 26 })}
                className="w-full h-1 bg-slate-200 rounded cursor-pointer accent-brand-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[11px] font-medium text-slate-700">पछाडिको रंग (Bg)</span>
                <input
                  type="color"
                  value={state.ctaBgColor || "#0e4f82"}
                  onChange={(e) => onChange({ ctaBgColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[11px] font-medium text-slate-700">अक्षरको रंग (Text)</span>
                <input
                  type="color"
                  value={state.ctaTextColor || "#ffffff"}
                  onChange={(e) => onChange({ ctaTextColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <hr className="border-slate-150" />

      {/* 10. Top & Bottom Accent Bars */}
      <div className="space-y-2 pb-6">
        <label className="text-xs font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-brand-800" />
          <span>🔲 Accent Bars (माथि/तल किनारा)</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700">माथिल्लो किनारा</span>
            <input
              type="color"
              value={state.topAccentBarColor}
              onChange={(e) => onChange({ topAccentBarColor: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer"
            />
          </div>
          <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700">तल्लो किनारा</span>
            <input
              type="color"
              value={state.bottomAccentBarColor}
              onChange={(e) => onChange({ bottomAccentBarColor: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
