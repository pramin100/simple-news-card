"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  CardState,
  renderNewsCardToCanvas,
  getDimensionsForRatio,
} from "@/lib/canvasRenderer";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Hand,
  Sparkles,
  Download,
  Plus,
  Minus,
} from "lucide-react";

interface CanvasPreviewProps {
  state: CardState;
  onChange: (newState: Partial<CardState>) => void;
  photoImage: HTMLImageElement | null;
  logoImage: HTMLImageElement | null;
  adImage: HTMLImageElement | null;
  onDownload: () => void;
}

export default function CanvasPreview({
  state,
  onChange,
  photoImage,
  logoImage,
  adImage,
  onDownload,
}: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.55);
  const [autoScale, setAutoScale] = useState(0.55);
  const [isManualScale, setIsManualScale] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialOffsets, setInitialOffsets] = useState({ x: 0, y: 0 });
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { width: targetW, height: targetH } = getDimensionsForRatio(state.aspectRatio);

  // Compute responsive fit scale to maximize available screen space with left vertical toolbar clearance
  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    // Deduct 110px width for the left vertical toolbar and 40px height for padding
    const containerW = containerRef.current.clientWidth - 110;
    const containerH = containerRef.current.clientHeight - 40;

    if (containerW <= 0 || containerH <= 0) return;

    const scaleX = containerW / targetW;
    const scaleY = containerH / targetH;
    // Maximize up to 1.1x for large screens
    const fitScale = Math.min(scaleX, scaleY, 1.1);
    const computed = Math.max(0.25, Number(fitScale.toFixed(3)));

    setAutoScale(computed);
    if (!isManualScale) {
      setScale(computed);
    }
  }, [targetW, targetH, isManualScale]);

  useEffect(() => {
    updateScale();
    if (!containerRef.current) return;

    const ro = new ResizeObserver(() => {
      updateScale();
    });
    ro.observe(containerRef.current);

    window.addEventListener("resize", updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [updateScale]);

  // Adjust canvas zoom
  const handleCanvasZoom = (delta: number) => {
    setIsManualScale(true);
    setScale((prev) => {
      const next = Math.max(0.3, Math.min(1.5, Number((prev + delta).toFixed(2))));
      return next;
    });
  };

  const handleResetCanvasZoom = () => {
    setIsManualScale(false);
    setScale(autoScale);
  };

  // Render on canvas whenever state or images change
  useEffect(() => {
    if (!canvasRef.current) return;
    renderNewsCardToCanvas(canvasRef.current, state, {
      photo: photoImage || undefined,
      logo: logoImage || undefined,
      ad: adImage || undefined,
    });
  }, [state, photoImage, logoImage, adImage]);

  // Drag-to-pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialOffsets({ x: state.photoOffsetX, y: state.photoOffsetY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = (e.clientX - dragStart.x) / scale;
    const dy = (e.clientY - dragStart.y) / scale;
    onChange({
      photoOffsetX: Math.round(initialOffsets.x + dx),
      photoOffsetY: Math.round(initialOffsets.y + dy),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setInitialOffsets({ x: state.photoOffsetX, y: state.photoOffsetY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = (e.touches[0].clientX - dragStart.x) / scale;
    const dy = (e.touches[0].clientY - dragStart.y) / scale;
    onChange({
      photoOffsetX: Math.round(initialOffsets.x + dx),
      photoOffsetY: Math.round(initialOffsets.y + dy),
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <main className="flex-1 h-full min-h-[calc(100vh-3.5rem)] lg:min-h-0 lg:h-full bg-gradient-to-br from-slate-200 via-sky-100/40 to-slate-200 relative overflow-hidden select-none">
      {/* Scrollable Viewport with right padding for vertical toolbar */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-auto flex items-center justify-center p-4 sm:p-6 pr-16 sm:pr-20"
      >
        {/* Floating Canvas Wrapper with dynamic border radius, shadow, and centered margin */}
        <div
          className="relative overflow-hidden shadow-2xl shadow-slate-900/30 border border-white/60 bg-white transition-all flex-shrink-0 m-auto"
          style={{
            width: Math.round(targetW * scale),
            height: Math.round(targetH * scale),
            minWidth: Math.round(targetW * scale),
            minHeight: Math.round(targetH * scale),
            borderRadius: `${Math.round((state.cardBorderRadius || 0) * scale)}px`,
          }}
        >
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 origin-top-left"
            style={{
              transform: `scale(${scale})`,
              width: targetW,
              height: targetH,
            }}
          />

          {/* Interactive Drag Overlay for Photo Section */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`absolute top-0 left-0 w-full cursor-grab active:cursor-grabbing z-10 transition-opacity ${
              isDragging ? "bg-brand-500/10" : "hover:bg-brand-500/5"
            }`}
            style={{
              height: `${state.aspectRatio === "16:9" ? "45%" : state.aspectRatio === "9:16" ? "58%" : "53%"}`,
            }}
            title="फोटो पोजिसन सार्न तान्नुहोस् (Drag to position photo)"
          />
        </div>
      </div>

      {/* Floating Canvas Quick Controls Bar (Vertically positioned to the right of the news card) */}
      <aside
        aria-label="Canvas Zoom and Quick Controls"
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl shadow-2xl border border-slate-700/80 z-30 text-xs font-semibold text-slate-200 transition-all pointer-events-auto"
      >
        {/* Section 1: Card View Zoom Controls (Vertical Stack) */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            भ्यू
          </span>
          <button
            type="button"
            onClick={() => handleCanvasZoom(0.05)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
            title="कार्ड ठूलो बनाउनुहोस् (Zoom In Card View)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-bold text-amber-400 text-center font-mono py-0.5">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => handleCanvasZoom(-0.05)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
            title="कार्ड सानो बनाउनुहोस् (Zoom Out Card View)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          {isManualScale && (
            <button
              type="button"
              onClick={handleResetCanvasZoom}
              className="px-1.5 py-0.5 text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium transition-colors mt-0.5"
              title="Fit to Screen"
            >
              Fit
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="w-5 border-t border-slate-700/80 my-1" />

        {/* Section 2: Photo Pan & Zoom Controls (Vertical Stack) */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="p-0.5 text-slate-400" title="फोटो पोजिसन / जुम">
            <Hand className="w-3 h-3 text-brand-300" />
          </div>
          <button
            type="button"
            onClick={() => onChange({ photoZoom: Math.min(300, state.photoZoom + 10) })}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
            title="Photo Zoom In (+10%)"
          >
            <Plus className="w-3 h-3" />
          </button>
          <span className="text-[10px] font-bold text-slate-300 text-center font-mono py-0.5">
            {state.photoZoom}%
          </span>
          <button
            type="button"
            onClick={() => onChange({ photoZoom: Math.max(40, state.photoZoom - 10) })}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
            title="Photo Zoom Out (-10%)"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => onChange({ photoOffsetX: 0, photoOffsetY: 0, photoZoom: 100 })}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset Photo Pan/Zoom"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-5 border-t border-slate-700/80 my-1" />

        {/* Section 3: Fullscreen HD Modal Trigger */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="ठूलो Preview हेर्नुहोस् (Fullscreen HD)"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </aside>

      {/* Lightbox Modal (Fullscreen HD preview) */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-between p-4 animate-fade-in">
          <div className="w-full flex items-center justify-between text-white max-w-4xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-orange" />
              <span className="font-bold text-sm">Full HD Live Card Preview</span>
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all"
            >
              ✕ बन्द गर्नुहोस् (Close)
            </button>
          </div>

          {/* Centered Large Preview */}
          <div className="flex-1 flex items-center justify-center p-2 max-w-full max-h-[80vh]">
            <img
              src={canvasRef.current?.toDataURL("image/png")}
              alt="High Resolution Preview"
              className="max-h-full max-w-full shadow-2xl border border-white/20 object-contain"
              style={{
                borderRadius: `${state.cardBorderRadius || 0}px`,
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onDownload}
              className="px-6 py-2.5 bg-gradient-to-r from-accent-orange to-orange-500 hover:from-orange-600 hover:to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG ({targetW}×{targetH})</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
