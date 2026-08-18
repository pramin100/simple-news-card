export interface CardState {
  // Dimensions & Aspect Ratio
  aspectRatio: "4:5" | "1:1" | "16:9" | "9:16";
  width: number;
  height: number;

  // Headline
  headline: string;
  headlineFontSize: number;
  headlineFont: string;
  headlineColor: string;
  headlineHighlightColor: string;
  headlineAlign: "left" | "center" | "right";
  headlineOffsetX: number;
  headlineOffsetY: number;
  showHeadlineBar: boolean;
  headlineBarColor: string;

  // Lead / Summary
  showLead: boolean;
  leadText: string;
  leadFontSize: number;
  leadColor: string;

  // Issue / Category Tag
  showIssue: boolean;
  issueText: string;
  issueFont: string;
  issueFontSize?: number;
  issueColor: string;
  issueTextColor: string;
  showIssueDot?: boolean;

  // Date
  showDate: boolean;
  dateText: string;
  dateFontSize?: number;
  dateFormatIndex: number;
  dateBgColor: string;
  dateTextColor: string;
  dateStyle?: "pill" | "glass" | "minimal" | "badge";
  showDateIcon?: boolean;

  // Photo
  photoSrc: string | null;
  photoZoom: number; // 50 to 300 (%)
  photoOffsetX: number;
  photoOffsetY: number;
  photoBrightness: number; // 20 to 150 (%)
  photoEffect:
    | "none"
    | "bw"
    | "sepia"
    | "vivid"
    | "dark"
    | "warm"
    | "cool"
    | "cine"
    | "vintage"
    | "hicon"
    | "noir";
  showPhotoBorder: boolean;
  photoBorderColor: string;
  photoBorderWidth: number;

  // Logo
  showLogo: boolean;
  logoSrc: string | null;
  logoHeight: number;
  logoPosition:
    | "bottom-center"
    | "bottom-left"
    | "bottom-right"
    | "top-left"
    | "top-center"
    | "top-right";
  logoShape?: "circle" | "rounded" | "square";

  // Advertisement
  showAd: boolean;
  adSrc: string | null;
  adPosition: "footer" | "above";
  adHeight: number;

  // Panel Styling
  panelBgColor: string;
  panelTexture:
    | "none"
    | "dots"
    | "grain"
    | "vignette"
    | "halftone"
    | "paper"
    | "spotlight"
    | "linen";
  panelTextureOpacity: number; // 0.05 to 0.5
  panelTextureGap: number;
  panelTextureSize: number;

  // Accents & CTA
  topAccentBarColor: string;
  bottomAccentBarColor: string;
  showTopBar: boolean;
  showBottomBar: boolean;

  showCta: boolean;
  ctaText: string;
  ctaWebsite: string;
  ctaBgColor: string;
  ctaTextColor: string;
  ctaFontSize?: number;

  // Card Outer Corners
  cardBorderRadius?: number; // 0 for sharp rectangle, >0 for rounded
}

export const DEFAULT_CARD_STATE: CardState = {
  aspectRatio: "4:5",
  width: 1080,
  height: 1350,
  cardBorderRadius: 0,

  headline: "नमस्ते ! नवयुग टेक एन्ड सफ्टले निर्माण गरेको पोस्टर मेकर टूलमा स्वागत छ ।",
  headlineFontSize: 56,
  headlineFont: "Noto Serif Devanagari",
  headlineColor: "#8b0000",
  headlineHighlightColor: "#ff6b00",
  headlineAlign: "left",
  headlineOffsetX: 0,
  headlineOffsetY: 0,
  showHeadlineBar: true,
  headlineBarColor: "#1a6fad",

  showLead: true,
  leadText: "सामाजिक सञ्जालका लागि आकर्षक र व्यावसायिक समाचार कार्ड केही सेकेन्डमै बनाउनुहोस्।",
  leadFontSize: 24,
  leadColor: "#334155",

  showIssue: true,
  issueText: "ताजा अपडेट",
  issueFont: "Mukta",
  issueFontSize: 26,
  issueColor: "#c0392b",
  issueTextColor: "#ffffff",
  showIssueDot: true,

  showDate: true,
  dateText: "",
  dateFontSize: 24,
  dateFormatIndex: 0,
  dateBgColor: "#1a6fad",
  dateTextColor: "#ffffff",
  dateStyle: "pill",
  showDateIcon: true,

  photoSrc: null,
  photoZoom: 100,
  photoOffsetX: 0,
  photoOffsetY: 0,
  photoBrightness: 100,
  photoEffect: "none",
  showPhotoBorder: false,
  photoBorderColor: "#ffffff",
  photoBorderWidth: 6,

  showLogo: true,
  logoSrc: null,
  logoHeight: 110,
  logoPosition: "bottom-center",
  logoShape: "circle",

  showAd: false,
  adSrc: null,
  adPosition: "footer",
  adHeight: 120,

  panelBgColor: "#ffffff",
  panelTexture: "dots",
  panelTextureOpacity: 0.12,
  panelTextureGap: 24,
  panelTextureSize: 3,

  topAccentBarColor: "#1a6fad",
  bottomAccentBarColor: "#ff6b00",
  showTopBar: true,
  showBottomBar: true,

  showCta: true,
  ctaText: "विस्तृत समाचार कमेन्टमा",
  ctaWebsite: "www.manavaawaj.com",
  ctaBgColor: "#0e4f82",
  ctaTextColor: "#ffffff",
  ctaFontSize: 25,
};

export function getDimensionsForRatio(ratio: "4:5" | "1:1" | "16:9" | "9:16"): { width: number; height: number } {
  switch (ratio) {
    case "4:5":
      return { width: 1080, height: 1350 };
    case "1:1":
      return { width: 1080, height: 1080 };
    case "16:9":
      return { width: 1200, height: 675 };
    case "9:16":
      return { width: 1080, height: 1920 };
    default:
      return { width: 1080, height: 1350 };
  }
}

// Helper to wrap text into lines and parse *highlight* segments
interface TextSegment {
  text: string;
  isHighlight: boolean;
}

interface WrappedLine {
  segments: TextSegment[];
  totalWidth: number;
}

export function parseHighlightSegments(text: string): TextSegment[] {
  const parts = text.split(/(\*[^*]+\*)/g);
  const segments: TextSegment[] = [];

  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 1) {
      segments.push({
        text: part.slice(1, -1),
        isHighlight: true,
      });
    } else {
      segments.push({
        text: part,
        isHighlight: false,
      });
    }
  }

  return segments;
}

function wrapTextWithHighlights(
  ctx: CanvasRenderingContext2D,
  rawText: string,
  maxWidth: number,
  fontFamily: string,
  fontSize: number,
  fontWeight: string = "700"
): WrappedLine[] {
  ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;

  const inputLines = rawText.split("\n");
  const resultLines: WrappedLine[] = [];

  for (const line of inputLines) {
    if (!line.trim()) {
      resultLines.push({ segments: [{ text: "", isHighlight: false }], totalWidth: 0 });
      continue;
    }

    const words = line.split(" ");
    let currentLineSegments: TextSegment[] = [];
    let currentLineWidth = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i] + (i < words.length - 1 ? " " : "");
      const isHl = word.startsWith("*") && word.includes("*", 1);
      const cleanWord = isHl ? word.replace(/\*/g, "") : word;

      const wordWidth = ctx.measureText(cleanWord).width;

      if (currentLineWidth + wordWidth > maxWidth && currentLineSegments.length > 0) {
        resultLines.push({ segments: currentLineSegments, totalWidth: currentLineWidth });
        currentLineSegments = [{ text: cleanWord, isHighlight: isHl }];
        currentLineWidth = wordWidth;
      } else {
        currentLineSegments.push({ text: cleanWord, isHighlight: isHl });
        currentLineWidth += wordWidth;
      }
    }

    if (currentLineSegments.length > 0) {
      resultLines.push({ segments: currentLineSegments, totalWidth: currentLineWidth });
    }
  }

  return resultLines;
}

/**
 * Main draw function for the News Card
 */
export async function renderNewsCardToCanvas(
  canvas: HTMLCanvasElement,
  state: CardState,
  imagesCache: {
    photo?: HTMLImageElement;
    logo?: HTMLImageElement;
    ad?: HTMLImageElement;
  }
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = getDimensionsForRatio(state.aspectRatio);
  canvas.width = width;
  canvas.height = height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Apply Card Border Radius clipping if enabled
  const hasRoundedCorners = Boolean(state.cardBorderRadius && state.cardBorderRadius > 0);
  if (hasRoundedCorners) {
    ctx.save();
    roundRect(ctx, 0, 0, width, height, state.cardBorderRadius!);
    ctx.clip();
  }

  // Calculate layout geometry
  const topAccentH = state.showTopBar ? 8 : 0;
  const bottomAccentH = state.showBottomBar ? 10 : 0;

  // Ad layout calculation
  let adFooterH = 0;
  let adAboveH = 0;
  if (state.showAd && imagesCache.ad) {
    if (state.adPosition === "footer") {
      adFooterH = Math.min(state.adHeight, height * 0.16);
    } else {
      adAboveH = Math.min(state.adHeight, height * 0.14);
    }
  }

  // Vertical partitioning
  const ctaH = state.showCta !== false ? Math.max(68, Math.round((state.ctaFontSize || 26) * 2.7)) : 0;
  const photoHRatio = state.aspectRatio === "16:9" ? 0.45 : state.aspectRatio === "9:16" ? 0.58 : 0.53;
  const photoH = Math.round((height - topAccentH - bottomAccentH - adFooterH) * photoHRatio);
  const panelY = topAccentH + photoH + adAboveH;
  const panelH = height - panelY - adFooterH - bottomAccentH;

  // 1. Draw Top Accent Bar
  if (state.showTopBar) {
    ctx.fillStyle = state.topAccentBarColor;
    ctx.fillRect(0, 0, width, topAccentH);
  }

  // 2. Draw Featured Photo
  const photoY = topAccentH;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, photoY, width, photoH);
  ctx.clip();

  if (imagesCache.photo && imagesCache.photo.complete && imagesCache.photo.naturalWidth > 0) {
    const img = imagesCache.photo;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = width / photoH;

    let baseW = width;
    let baseH = photoH;

    if (imgRatio > boxRatio) {
      baseW = photoH * imgRatio;
    } else {
      baseH = width / imgRatio;
    }

    const zoom = Math.max(0.2, state.photoZoom / 100);
    const renderW = baseW * zoom;
    const renderH = baseH * zoom;

    const centerX = width / 2 + state.photoOffsetX;
    const centerY = photoY + photoH / 2 + state.photoOffsetY;
    const drawX = centerX - renderW / 2;
    const drawY = centerY - renderH / 2;

    // Apply brightness
    if (state.photoBrightness !== 100) {
      ctx.filter = `brightness(${state.photoBrightness}%)`;
    }

    ctx.drawImage(img, drawX, drawY, renderW, renderH);
    ctx.filter = "none";

    // Apply Photo Effects
    applyPhotoFilter(ctx, state.photoEffect, 0, photoY, width, photoH);
  } else {
    // Default placeholder photo pattern
    const grad = ctx.createLinearGradient(0, photoY, width, photoY + photoH);
    grad.addColorStop(0, "#1e293b");
    grad.addColorStop(1, "#0f172a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, photoY, width, photoH);

    // Decorative camera icon & text
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.font = "bold 90px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("📷", width / 2, photoY + photoH / 2 - 10);
    ctx.font = "600 24px 'Noto Sans Devanagari', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillText("समाचारको फोटो छान्नुहोस् (Upload Featured Photo)", width / 2, photoY + photoH / 2 + 45);
    ctx.textAlign = "left";
  }

  // Draw Photo Border if enabled
  if (state.showPhotoBorder && state.photoBorderWidth > 0) {
    ctx.lineWidth = state.photoBorderWidth;
    ctx.strokeStyle = state.photoBorderColor;
    ctx.strokeRect(
      state.photoBorderWidth / 2,
      photoY + state.photoBorderWidth / 2,
      width - state.photoBorderWidth,
      photoH - state.photoBorderWidth
    );
  }
  ctx.restore();

  // 3. Draw Ad Banner if positioned 'above'
  if (adAboveH > 0 && imagesCache.ad) {
    drawAdBanner(ctx, imagesCache.ad, 0, topAccentH + photoH, width, adAboveH);
  }

  // 4. Draw Bottom Content Panel
  ctx.fillStyle = state.panelBgColor;
  ctx.fillRect(0, panelY, width, panelH);

  // Draw Panel Texture
  if (state.panelTexture !== "none") {
    drawPanelTexture(
      ctx,
      state.panelTexture,
      0,
      panelY,
      width,
      panelH,
      state.panelTextureOpacity,
      state.panelTextureGap,
      state.panelTextureSize,
      state.panelBgColor
    );
  }

  // 5. Draw Badges (Issue / Category Tag and Modern Date Pill)
  const issueFontSize = state.issueFontSize || 26;
  const dateFontSize = state.dateFontSize || 24;
  // Generous badge height for spacious top and bottom padding
  const badgeH = Math.max(56, Math.round(Math.max(issueFontSize, dateFontSize) * 2.15));
  const badgeY = panelY + 30;
  const paddingX = 48;

  // 5a. Issue / Category Tag
  let issueRight = paddingX;
  if (state.showIssue && state.issueText.trim()) {
    ctx.font = `700 ${issueFontSize}px "${state.issueFont || "Mukta"}", sans-serif`;
    const issueTextWidth = ctx.measureText(state.issueText).width;
    const hasDot = state.showIssueDot !== false;
    const dotSize = Math.max(4, Math.round(issueFontSize * 0.18));
    const dotSpace = hasDot ? (dotSize * 2 + 14) : 0;
    const issuePadX = 24;
    const issueBoxW = issueTextWidth + issuePadX * 2 + dotSpace;

    ctx.save();
    // Subtle drop shadow for depth
    ctx.shadowColor = "rgba(0, 0, 0, 0.12)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;

    // Clean modern rounded rectangle
    ctx.fillStyle = state.issueColor;
    roundRect(ctx, paddingX, badgeY, issueBoxW, badgeH, 12);
    ctx.fill();
    ctx.restore();

    // Draw live status dot if enabled
    let textX = paddingX + issuePadX;
    if (hasDot) {
      const dotX = paddingX + issuePadX + dotSize;
      const dotY = badgeY + badgeH / 2;
      const dotColor = state.issueTextColor || "#ffffff";
      drawLiveDot(ctx, dotX, dotY, dotSize, dotColor);
      textX = dotX + dotSize + 12;
    }

    ctx.fillStyle = state.issueTextColor || "#ffffff";
    ctx.font = `700 ${issueFontSize}px "${state.issueFont || "Mukta"}", sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillText(state.issueText, textX, badgeY + badgeH / 2);
    ctx.textBaseline = "alphabetic";

    issueRight = paddingX + issueBoxW + 20;
  }

  // 5b. Nepali Date Container (Modern, Clean, Spacious Padding)
  if (state.showDate && state.dateText.trim()) {
    ctx.font = `600 ${dateFontSize}px 'Noto Sans Devanagari', sans-serif`;
    const dateWidth = ctx.measureText(state.dateText).width;
    const hasIcon = state.showDateIcon !== false;
    const iconSize = Math.max(18, Math.round(dateFontSize * 0.82));
    const iconSpace = hasIcon ? iconSize + 12 : 0;
    // Generous left & right padding of 26px each
    const datePadX = 26;
    const dateBoxW = dateWidth + datePadX * 2 + iconSpace;
    const dateX = Math.max(issueRight, width - paddingX - dateBoxW);
    const dateStyle = state.dateStyle || "pill";
    const radius = dateStyle === "badge" ? 12 : badgeH / 2;

    ctx.save();

    if (dateStyle === "glass") {
      // Glassmorphism frosted style
      const isDark = isColorDark(state.panelBgColor);
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.85)";
      ctx.shadowColor = "rgba(0, 0, 0, 0.08)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;
      roundRect(ctx, dateX, badgeY, dateBoxW, badgeH, radius);
      ctx.fill();

      // Frosted border
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.1)";
      ctx.lineWidth = 1.2;
      roundRect(ctx, dateX, badgeY, dateBoxW, badgeH, radius);
      ctx.stroke();
    } else if (dateStyle === "minimal") {
      // Minimal Outline / Ghost
      ctx.strokeStyle = state.dateTextColor || (isColorDark(state.panelBgColor) ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.18)");
      ctx.lineWidth = 1.5;
      roundRect(ctx, dateX, badgeY, dateBoxW, badgeH, radius);
      ctx.stroke();
    } else if (dateStyle === "badge") {
      // Modern Rounded Badge
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
      ctx.shadowBlur = 5;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = state.dateBgColor;
      roundRect(ctx, dateX, badgeY, dateBoxW, badgeH, radius);
      ctx.fill();

      // Fine border overlay
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1;
      roundRect(ctx, dateX, badgeY, dateBoxW, badgeH, radius);
      ctx.stroke();
    } else {
      // Default: Modern Sleek Pill with subtle depth & top highlight
      ctx.shadowColor = "rgba(0, 0, 0, 0.12)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = state.dateBgColor;
      roundRect(ctx, dateX, badgeY, dateBoxW, badgeH, radius);
      ctx.fill();

      // Subtle light border overlay
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1;
      roundRect(ctx, dateX, badgeY, dateBoxW, badgeH, radius);
      ctx.stroke();
    }

    ctx.restore();

    // Determine content text & icon color
    const textColor = dateStyle === "glass" && !state.dateTextColor
      ? (isColorDark(state.panelBgColor) ? "#ffffff" : "#1e293b")
      : (state.dateTextColor || "#ffffff");

    let contentStartX = dateX + datePadX;

    // Draw Vector Calendar Icon
    if (hasIcon) {
      const iconY = badgeY + (badgeH - iconSize * 0.95) / 2;
      drawCalendarIcon(ctx, contentStartX, iconY, iconSize, textColor);
      contentStartX += iconSize + 12;
    }

    // Draw Date Text
    ctx.fillStyle = textColor;
    ctx.font = `600 ${dateFontSize}px 'Noto Sans Devanagari', sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillText(state.dateText, contentStartX, badgeY + badgeH / 2);
    ctx.textBaseline = "alphabetic";
  }

  // 6. Draw Headline
  const headlineStartY = badgeY + badgeH + 32 + state.headlineOffsetY;
  const maxTextWidth = width - paddingX * 2 - (state.showHeadlineBar ? 26 : 0);
  const textStartX = paddingX + (state.showHeadlineBar ? 24 : 0) + state.headlineOffsetX;

  const headlineLines = wrapTextWithHighlights(
    ctx,
    state.headline,
    maxTextWidth,
    state.headlineFont,
    state.headlineFontSize,
    "700"
  );

  const lineHeight = Math.round(state.headlineFontSize * 1.35);
  let currentY = headlineStartY;

  // Draw Headline Accent Bar (vertical line next to headline)
  if (state.showHeadlineBar && headlineLines.length > 0) {
    const totalHeadlineH = headlineLines.length * lineHeight;
    ctx.fillStyle = state.headlineBarColor;
    roundRect(ctx, paddingX, headlineStartY - state.headlineFontSize + 6, 8, totalHeadlineH - 6, 4);
    ctx.fill();
  }

  // Draw each line of headline
  for (const line of headlineLines) {
    let lineX = textStartX;
    if (state.headlineAlign === "center") {
      lineX = textStartX + (maxTextWidth - line.totalWidth) / 2;
    } else if (state.headlineAlign === "right") {
      lineX = textStartX + (maxTextWidth - line.totalWidth);
    }

    ctx.font = `700 ${state.headlineFontSize}px "${state.headlineFont}", sans-serif`;

    for (const seg of line.segments) {
      ctx.fillStyle = seg.isHighlight ? state.headlineHighlightColor : state.headlineColor;
      ctx.fillText(seg.text, lineX, currentY);
      lineX += ctx.measureText(seg.text).width;
    }

    currentY += lineHeight;
  }

  // 7. Draw Lead / Summary
  if (state.showLead && state.leadText.trim()) {
    currentY += 12;
    ctx.font = `500 ${state.leadFontSize}px 'Noto Sans Devanagari', sans-serif`;
    ctx.fillStyle = state.leadColor;

    const leadLines = wrapTextWithHighlights(
      ctx,
      state.leadText,
      width - paddingX * 2,
      "Noto Sans Devanagari",
      state.leadFontSize,
      "500"
    );

    const leadLineH = Math.round(state.leadFontSize * 1.45);
    for (const lLine of leadLines) {
      let lX = paddingX;
      if (state.headlineAlign === "center") {
        lX = paddingX + (width - paddingX * 2 - lLine.totalWidth) / 2;
      }
      for (const seg of lLine.segments) {
        ctx.fillText(seg.text, lX, currentY);
        lX += ctx.measureText(seg.text).width;
      }
      currentY += leadLineH;
    }
  }

  // 8. Draw CTA (Call To Action) Bottom Bar
  if (state.showCta !== false) {
    const ctaBg = state.ctaBgColor || "#0e4f82";
    const ctaTextColor = state.ctaTextColor || "#ffffff";
    const ctaText = state.ctaText !== undefined ? state.ctaText : "विस्तृत समाचार कमेन्टमा";
    const ctaWebsite = state.ctaWebsite !== undefined ? state.ctaWebsite : "nawayugtech.com";

    const ctaY = panelY + panelH - ctaH;

    ctx.save();
    // Background
    ctx.fillStyle = ctaBg;
    ctx.fillRect(0, ctaY, width, ctaH);

    // Top border line
    ctx.strokeStyle = isColorDark(ctaBg) ? "rgba(255, 255, 255, 0.18)" : "rgba(0, 0, 0, 0.12)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, ctaY);
    ctx.lineTo(width, ctaY);
    ctx.stroke();

    const ctaFontSize = state.ctaFontSize || 26;
    const siteFontSize = Math.round(ctaFontSize * 0.96);
    const sloganFontSize = ctaFontSize;

    // 1. Measure and Draw Right Website Branding Pill first
    let sitePillW = 0;
    let sitePillX = width - paddingX;
    if (ctaWebsite && ctaWebsite.trim()) {
      ctx.font = `700 ${siteFontSize}px 'Inter', sans-serif`;
      const siteTextWidth = ctx.measureText(ctaWebsite.trim()).width;
      const sitePillPadX = Math.round(siteFontSize * 0.65);
      const sitePillH = Math.round(siteFontSize * 1.6);
      const globeSize = Math.round(siteFontSize * 0.72);
      sitePillW = siteTextWidth + sitePillPadX * 2 + globeSize + 8;
      sitePillX = width - paddingX - sitePillW;
      const sitePillY = ctaY + (ctaH - sitePillH) / 2;

      // Pill container background
      ctx.fillStyle = isColorDark(ctaBg) ? "rgba(255, 255, 255, 0.16)" : "rgba(0, 0, 0, 0.08)";
      roundRect(ctx, sitePillX, sitePillY, sitePillW, sitePillH, sitePillH / 2);
      ctx.fill();

      // Pill border
      ctx.strokeStyle = isColorDark(ctaBg) ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.15)";
      ctx.lineWidth = 1;
      roundRect(ctx, sitePillX, sitePillY, sitePillW, sitePillH, sitePillH / 2);
      ctx.stroke();

      // Globe Icon inside pill
      const globeX = sitePillX + sitePillPadX;
      const globeY = sitePillY + (sitePillH - globeSize) / 2;
      drawGlobeIcon(ctx, globeX, globeY, globeSize, ctaTextColor);

      // Website Text
      ctx.fillStyle = ctaTextColor;
      ctx.textBaseline = "middle";
      ctx.fillText(ctaWebsite.trim(), globeX + globeSize + 8, sitePillY + sitePillH / 2);
    }

    // 2. Draw Left Slogan Text + Icon with collision protection
    let leftTextStartX = paddingX;
    const iconSize = Math.round(sloganFontSize * 0.85);
    const iconY = ctaY + (ctaH - iconSize) / 2;
    drawCommentIcon(ctx, leftTextStartX, iconY, iconSize, ctaTextColor);
    leftTextStartX += iconSize + 10;

    if (ctaText && ctaText.trim()) {
      ctx.fillStyle = ctaTextColor;
      ctx.font = `700 ${sloganFontSize}px 'Noto Sans Devanagari', Mukta, sans-serif`;
      ctx.textBaseline = "middle";
      const maxSloganW = sitePillW > 0 ? (sitePillX - leftTextStartX - 18) : (width - leftTextStartX - paddingX);

      let renderSlogan = ctaText.trim();
      if (ctx.measureText(renderSlogan).width > maxSloganW && maxSloganW > 60) {
        while (renderSlogan.length > 0 && ctx.measureText(renderSlogan + "...").width > maxSloganW) {
          renderSlogan = renderSlogan.slice(0, -1);
        }
        renderSlogan += "...";
      }
      ctx.fillText(renderSlogan, leftTextStartX, ctaY + ctaH / 2);
    }

    ctx.restore();
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  // 9. Draw Ad Banner if positioned 'footer'
  if (adFooterH > 0 && imagesCache.ad) {
    const adY = panelY + panelH;
    drawAdBanner(ctx, imagesCache.ad, 0, adY, width, adFooterH);
  }

  // 10. Draw Bottom Accent Bar
  if (state.showBottomBar) {
    ctx.fillStyle = state.bottomAccentBarColor;
    ctx.fillRect(0, height - bottomAccentH, width, bottomAccentH);
  }

  // 11. Draw Company / Brand Logo (Always on top layer for crisp visibility)
  if (state.showLogo && imagesCache.logo && imagesCache.logo.complete && imagesCache.logo.naturalWidth > 0) {
    const logoImg = imagesCache.logo;
    const diameter = Math.max(40, state.logoHeight || 110);
    const radius = diameter / 2;
    const shape = state.logoShape || "circle";
    const photoBottomY = topAccentH + photoH;

    let centerX = width / 2;
    let centerY = photoBottomY;

    if (state.logoPosition === "bottom-center") {
      centerX = width / 2;
      centerY = photoBottomY;
    } else if (state.logoPosition === "bottom-left") {
      centerX = paddingX + radius;
      centerY = photoBottomY;
    } else if (state.logoPosition === "bottom-right") {
      centerX = width - paddingX - radius;
      centerY = photoBottomY;
    } else if (state.logoPosition === "top-left") {
      centerX = paddingX + radius;
      centerY = topAccentH + 20 + radius;
    } else if (state.logoPosition === "top-center") {
      centerX = width / 2;
      centerY = topAccentH + 20 + radius;
    } else if (state.logoPosition === "top-right") {
      centerX = width - paddingX - radius;
      centerY = topAccentH + 20 + radius;
    }

    const boxX = centerX - radius;
    const boxY = centerY - radius;

    // 1. Logo container background with rich drop shadow
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    if (shape === "circle") {
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    } else if (shape === "rounded") {
      roundRect(ctx, boxX, boxY, diameter, diameter, 16);
    } else {
      ctx.rect(boxX, boxY, diameter, diameter);
    }
    ctx.fill();
    ctx.restore();

    // 2. Subtle crisp outer ring border
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    if (shape === "circle") {
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    } else if (shape === "rounded") {
      roundRect(ctx, boxX, boxY, diameter, diameter, 16);
    } else {
      ctx.rect(boxX, boxY, diameter, diameter);
    }
    ctx.stroke();
    ctx.restore();

    // 3. Clip path and draw the logo image scaled cleanly with inner padding
    ctx.save();
    ctx.beginPath();
    if (shape === "circle") {
      ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2);
    } else if (shape === "rounded") {
      roundRect(ctx, boxX + 2, boxY + 2, diameter - 4, diameter - 4, 14);
    } else {
      ctx.rect(boxX + 2, boxY + 2, diameter - 4, diameter - 4);
    }
    ctx.clip();

    const innerPad = Math.round(diameter * 0.12);
    const maxW = diameter - innerPad * 2;
    const maxH = diameter - innerPad * 2;
    const imgRatio = logoImg.naturalWidth / logoImg.naturalHeight;

    let drawW = maxW;
    let drawH = maxH;
    if (imgRatio > 1) {
      drawH = maxW / imgRatio;
    } else {
      drawW = maxH * imgRatio;
    }

    const drawX = centerX - drawW / 2;
    const drawY = centerY - drawH / 2;
    ctx.drawImage(logoImg, drawX, drawY, drawW, drawH);
    ctx.restore();
  }

  if (hasRoundedCorners) {
    ctx.restore();
  }
}

/**
 * Draw advertisement banner with aspect-ratio preservation
 */
function drawAdBanner(
  ctx: CanvasRenderingContext2D,
  adImg: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, w, h);

  // Border line separating ad
  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  if (adImg.complete && adImg.naturalWidth > 0) {
    const imgRatio = adImg.naturalWidth / adImg.naturalHeight;
    const targetRatio = w / h;

    let drawW = w;
    let drawH = h;
    let drawX = x;
    let drawY = y;

    if (imgRatio > targetRatio) {
      drawH = w / imgRatio;
      drawY = y + (h - drawH) / 2;
    } else {
      drawW = h * imgRatio;
      drawX = x + (w - drawW) / 2;
    }

    ctx.drawImage(adImg, drawX, drawY, drawW, drawH);
  }
}

/**
 * Procedural texture patterns for card panel
 */
function drawPanelTexture(
  ctx: CanvasRenderingContext2D,
  texture: string,
  x: number,
  y: number,
  w: number,
  h: number,
  opacity: number,
  gap: number = 24,
  size: number = 3,
  bgColor: string = "#ffffff"
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  const isDarkBg = isColorDark(bgColor);
  const patternColor = isDarkBg ? "255, 255, 255" : "0, 0, 0";

  switch (texture) {
    case "dots": {
      ctx.fillStyle = `rgba(${patternColor}, ${opacity})`;
      const step = Math.max(12, gap);
      const r = Math.max(1, size / 2);
      for (let px = x + step / 2; px < x + w; px += step) {
        for (let py = y + step / 2; py < y + h; py += step) {
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
    case "grain": {
      // Procedural fine grain
      ctx.fillStyle = `rgba(${patternColor}, ${opacity * 0.7})`;
      const density = (w * h) / 180;
      for (let i = 0; i < density; i++) {
        const gx = x + Math.random() * w;
        const gy = y + Math.random() * h;
        ctx.fillRect(gx, gy, 1.5, 1.5);
      }
      break;
    }
    case "vignette": {
      const grad = ctx.createRadialGradient(x + w / 2, y + h / 2, w * 0.2, x + w / 2, y + h / 2, w * 0.7);
      grad.addColorStop(0, `rgba(${patternColor}, 0)`);
      grad.addColorStop(1, `rgba(${patternColor}, ${opacity * 1.5})`);
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, w, h);
      break;
    }
    case "spotlight": {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, w * 0.8);
      grad.addColorStop(0, `rgba(255, 255, 255, ${opacity * 2})`);
      grad.addColorStop(1, `rgba(${patternColor}, 0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, w, h);
      break;
    }
    case "linen": {
      ctx.strokeStyle = `rgba(${patternColor}, ${opacity * 0.4})`;
      ctx.lineWidth = 1;
      const step = Math.max(8, gap / 2);
      for (let px = x; px < x + w; px += step) {
        ctx.beginPath();
        ctx.moveTo(px, y);
        ctx.lineTo(px, y + h);
        ctx.stroke();
      }
      for (let py = y; py < y + h; py += step) {
        ctx.beginPath();
        ctx.moveTo(x, py);
        ctx.lineTo(x + w, py);
        ctx.stroke();
      }
      break;
    }
    case "paper":
    case "halftone": {
      ctx.fillStyle = `rgba(${patternColor}, ${opacity})`;
      const step = Math.max(16, gap);
      for (let px = x + step / 2; px < x + w; px += step) {
        const factor = (px - x) / w;
        const radius = Math.max(0.5, (size * factor) / 1.5);
        for (let py = y + step / 2; py < y + h; py += step) {
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
  }

  ctx.restore();
}

/**
 * Apply photo color matrix / overlay filter
 */
function applyPhotoFilter(
  ctx: CanvasRenderingContext2D,
  effect: string,
  x: number,
  y: number,
  w: number,
  h: number
) {
  if (effect === "none") return;

  ctx.save();
  switch (effect) {
    case "bw":
      ctx.globalCompositeOperation = "color";
      ctx.fillStyle = "#808080";
      ctx.fillRect(x, y, w, h);
      break;
    case "sepia":
      ctx.globalCompositeOperation = "color";
      ctx.fillStyle = "#704214";
      ctx.fillRect(x, y, w, h);
      ctx.globalCompositeOperation = "overlay";
      ctx.fillStyle = "rgba(112, 66, 20, 0.35)";
      ctx.fillRect(x, y, w, h);
      break;
    case "vivid":
      ctx.globalCompositeOperation = "overlay";
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.fillRect(x, y, w, h);
      ctx.globalCompositeOperation = "soft-light";
      ctx.fillStyle = "rgba(255, 100, 0, 0.2)";
      ctx.fillRect(x, y, w, h);
      break;
    case "dark":
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.fillRect(x, y, w, h);
      break;
    case "warm":
      ctx.globalCompositeOperation = "soft-light";
      ctx.fillStyle = "rgba(255, 160, 50, 0.4)";
      ctx.fillRect(x, y, w, h);
      break;
    case "cool":
      ctx.globalCompositeOperation = "soft-light";
      ctx.fillStyle = "rgba(0, 150, 255, 0.35)";
      ctx.fillRect(x, y, w, h);
      break;
    case "cine":
      ctx.globalCompositeOperation = "color";
      ctx.fillStyle = "rgba(0, 80, 120, 0.3)";
      ctx.fillRect(x, y, w, h);
      ctx.globalCompositeOperation = "overlay";
      ctx.fillStyle = "rgba(255, 180, 100, 0.2)";
      ctx.fillRect(x, y, w, h);
      break;
    case "vintage":
      ctx.globalCompositeOperation = "color";
      ctx.fillStyle = "rgba(120, 100, 80, 0.4)";
      ctx.fillRect(x, y, w, h);
      break;
    case "hicon":
      ctx.globalCompositeOperation = "hard-light";
      ctx.fillStyle = "rgba(128, 128, 128, 0.3)";
      ctx.fillRect(x, y, w, h);
      break;
    case "noir":
      ctx.globalCompositeOperation = "color";
      ctx.fillStyle = "#000000";
      ctx.fillRect(x, y, w, h);
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(x, y, w, h);
      break;
  }
  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function isColorDark(hexColor: string): boolean {
  if (!hexColor.startsWith("#")) return false;
  const hex = hexColor.replace("#", "");
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  }
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  }
  return false;
}

/**
 * Draw crisp vector calendar icon directly onto Canvas
 */
function drawCalendarIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const w = size;
  const h = size * 0.95;
  const topH = h * 0.32;
  const r = 3;

  // Calendar body outline
  roundRect(ctx, x, y, w, h, r);
  ctx.stroke();

  // Top header separator line
  ctx.beginPath();
  ctx.moveTo(x, y + topH);
  ctx.lineTo(x + w, y + topH);
  ctx.stroke();

  // Two binder hooks
  const hookOffset1 = w * 0.28;
  const hookOffset2 = w * 0.72;
  ctx.beginPath();
  ctx.moveTo(x + hookOffset1, y - 2);
  ctx.lineTo(x + hookOffset1, y + 2);
  ctx.moveTo(x + hookOffset2, y - 2);
  ctx.lineTo(x + hookOffset2, y + 2);
  ctx.stroke();

  // Grid dots
  const dotR = 1;
  const dotY1 = y + topH + (h - topH) * 0.35;
  const dotY2 = y + topH + (h - topH) * 0.72;
  const dotX1 = x + w * 0.33;
  const dotX2 = x + w * 0.67;

  ctx.beginPath();
  ctx.arc(dotX1, dotY1, dotR, 0, Math.PI * 2);
  ctx.arc(dotX2, dotY1, dotR, 0, Math.PI * 2);
  ctx.arc(dotX1, dotY2, dotR, 0, Math.PI * 2);
  ctx.arc(dotX2, dotY2, dotR, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draw live status dot with subtle outer glow ring
 */
function drawLiveDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
) {
  ctx.save();
  // Outer soft glow ring
  ctx.beginPath();
  ctx.arc(x, y, radius + 2.5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.35;
  ctx.fill();

  // Inner solid core
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.globalAlpha = 1.0;
  ctx.fill();
  ctx.restore();
}

/**
 * Draw vector comment / chat bubble icon onto Canvas
 */
function drawCommentIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const w = size * 1.1;
  const h = size * 0.85;

  ctx.beginPath();
  ctx.moveTo(x + 4, y);
  ctx.lineTo(x + w - 4, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + 4);
  ctx.lineTo(x + w, y + h - 4);
  ctx.quadraticCurveTo(x + w, y + h, x + w - 4, y + h);
  ctx.lineTo(x + 9, y + h);
  ctx.lineTo(x + 4, y + h + 4);
  ctx.lineTo(x + 5, y + h);
  ctx.lineTo(x + 4, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - 4);
  ctx.lineTo(x, y + 4);
  ctx.quadraticCurveTo(x, y, x + 4, y);
  ctx.stroke();

  // Interior dots
  ctx.beginPath();
  ctx.arc(x + w * 0.3, y + h * 0.48, 1, 0, Math.PI * 2);
  ctx.arc(x + w * 0.5, y + h * 0.48, 1, 0, Math.PI * 2);
  ctx.arc(x + w * 0.7, y + h * 0.48, 1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draw vector globe icon onto Canvas
 */
function drawGlobeIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  ctx.lineCap = "round";

  const r = size / 2;
  const cx = x + r;
  const cy = y + r;

  // Outer circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Equator line
  ctx.beginPath();
  ctx.moveTo(cx - r, cy);
  ctx.lineTo(cx + r, cy);
  ctx.stroke();

  // Meridian ellipse
  ctx.beginPath();
  ctx.ellipse(cx, cy, Math.max(1, r * 0.48), r, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}


