import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";

async function fetchHtmlWithFallback(targetUrl: string) {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "ne,en-US;q=0.9,en;q=0.8",
    "Cache-Control": "no-cache",
  };

  try {
    const res = await fetch(targetUrl, {
      headers,
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
    });
    if (res.ok) {
      return { html: await res.text(), finalUrl: res.url || targetUrl };
    }
  } catch (err) {
    // If bare domain failed, try with www. or vice versa
    try {
      const parsed = new URL(targetUrl);
      const newHost = parsed.hostname.startsWith("www.")
        ? parsed.hostname.replace(/^www\./, "")
        : `www.${parsed.hostname}`;
      parsed.hostname = newHost;
      const retryUrl = parsed.toString();

      const retryRes = await fetch(retryUrl, {
        headers,
        redirect: "follow",
        signal: AbortSignal.timeout(12000),
      });
      if (retryRes.ok) {
        return { html: await retryRes.text(), finalUrl: retryRes.url || retryUrl };
      }
    } catch {
      // ignore retry error
    }
    throw err;
  }

  throw new Error("समाचार लिङ्क खोल्न सकिएन (Failed to fetch article)");
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let url = body.url?.trim();

    if (!url) {
      return NextResponse.json(
        { error: "समाचारको लिङ्क (URL) हाल्नुहोस् (Please provide a news link)" },
        { status: 400 }
      );
    }

    // Auto prepend https:// if missing
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "अमान्य लिङ्क (Invalid URL format)" },
        { status: 400 }
      );
    }

    const { html, finalUrl } = await fetchHtmlWithFallback(parsedUrl.toString());
    const $ = cheerio.load(html);
    const resolvedBaseUrl = new URL(finalUrl);

    // 1. JSON-LD structured data inspection
    let jsonLdHeadline: string | null = null;
    let jsonLdDescription: string | null = null;
    let jsonLdImage: string | null = null;
    let jsonLdLogo: string | null = null;
    let jsonLdCategory: string | null = null;
    let jsonLdDate: string | null = null;

    $('script[type="application/ld+json"]').each((_, elem) => {
      try {
        const rawJson = $(elem).html();
        if (!rawJson) return;
        const parsed = JSON.parse(rawJson);
        const items = Array.isArray(parsed) ? parsed : [parsed];

        for (const item of items) {
          const type = item["@type"];
          if (
            type === "NewsArticle" ||
            type === "Article" ||
            type === "BlogPosting" ||
            type === "Report" ||
            !jsonLdHeadline
          ) {
            if (item.headline) jsonLdHeadline = item.headline;
            if (item.name && !jsonLdHeadline) jsonLdHeadline = item.name;
            if (item.description) jsonLdDescription = item.description;
            if (item.articleSection) jsonLdCategory = item.articleSection;
            if (item.datePublished) jsonLdDate = item.datePublished;

            if (item.image) {
              if (typeof item.image === "string") {
                jsonLdImage = item.image;
              } else if (Array.isArray(item.image) && item.image.length > 0) {
                jsonLdImage = typeof item.image[0] === "string" ? item.image[0] : item.image[0]?.url;
              } else if (item.image.url) {
                jsonLdImage = item.image.url;
              }
            }

            const pub = item.publisher || item.organization;
            if (pub) {
              if (typeof pub.logo === "string") jsonLdLogo = pub.logo;
              else if (pub.logo?.url) jsonLdLogo = pub.logo.url;
              else if (typeof pub.image === "string") jsonLdLogo = pub.image;
            }
          }
        }
      } catch {
        // Skip unparseable JSON-LD
      }
    });

    // 2. Extract Title / Headline
    let rawTitle =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      jsonLdHeadline ||
      $("h1.entry-title").first().text() ||
      $("h1.post-title").first().text() ||
      $("article h1").first().text() ||
      $("h1").first().text() ||
      $('meta[name="title"]').attr("content") ||
      $("title").text() ||
      "";

    let cleanTitle = rawTitle.trim();
    // Clean up trailing site branding
    cleanTitle = cleanTitle
      .replace(/\s*[-–—|•:]\s*(OnlineKhabar|अनलाइनखबर|Setopati|सेतोपाटी|Ratopati|रातोपाटी|Kantipur|कान्तिपुर|Nagarik|नागरिक|Ujyaalo|उज्यालो|BBC News नेपाली|BBC News|पहिलोपोस्ट|Pahilopost|eKantipur).*$/i, "")
      .replace(/\s*[-–—|]\s*[^–—|-]+$/i, (match) => {
        if (match.length < 30) return "";
        return match;
      })
      .trim();

    if (!cleanTitle && rawTitle) {
      cleanTitle = rawTitle.trim();
    }

    // 3. Extract Featured Photo
    let rawImage =
      $('meta[property="og:image:secure_url"]').attr("content") ||
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $('meta[name="twitter:image:src"]').attr("content") ||
      jsonLdImage ||
      $('link[rel="image_src"]').attr("href") ||
      $("article figure img").first().attr("src") ||
      $("article img").first().attr("src") ||
      $(".featured-image img").first().attr("src") ||
      $(".post-thumbnail img").first().attr("src") ||
      null;

    let photoUrl: string | null = null;
    if (rawImage) {
      try {
        photoUrl = new URL(rawImage, resolvedBaseUrl.toString()).toString();
      } catch {
        photoUrl = rawImage;
      }
    }

    // 4. Extract Publisher / Site Logo
    let rawLogo =
      jsonLdLogo ||
      $('meta[property="og:logo"]').attr("content") ||
      $('header .site-logo img').first().attr("src") ||
      $('header .logo img').first().attr("src") ||
      $('.navbar-brand img').first().attr("src") ||
      $('.custom-logo').first().attr("src") ||
      $('header img[src*="logo" i]').first().attr("src") ||
      $('a[class*="logo" i] img').first().attr("src") ||
      $('img[class*="logo" i]').first().attr("src") ||
      $('img[alt*="logo" i]').first().attr("src") ||
      $('link[rel="apple-touch-icon-precomposed"]').attr("href") ||
      $('link[rel="apple-touch-icon"]').attr("href") ||
      $('link[rel="icon"][sizes*="192"]').attr("href") ||
      $('link[rel="icon"][sizes*="180"]').attr("href") ||
      $('link[rel="icon"]').attr("href") ||
      null;

    let logoUrl: string | null = null;
    if (rawLogo) {
      try {
        logoUrl = new URL(rawLogo, resolvedBaseUrl.toString()).toString();
      } catch {
        logoUrl = rawLogo;
      }
    } else {
      logoUrl = `https://www.google.com/s2/favicons?domain=${resolvedBaseUrl.hostname}&sz=128`;
    }

    // 5. Extract Lead / Summary
    let rawLead =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      jsonLdDescription ||
      $('meta[name="description"]').attr("content") ||
      $("article p").first().text() ||
      $(".post-content p").first().text() ||
      $(".entry-content p").first().text() ||
      "";

    let cleanLead = rawLead.trim().replace(/\s+/g, " ");
    if (cleanLead.length > 220) {
      const truncated = cleanLead.slice(0, 210);
      const lastPunctuation = Math.max(
        truncated.lastIndexOf("।"),
        truncated.lastIndexOf("."),
        truncated.lastIndexOf("?")
      );
      if (lastPunctuation > 60) {
        cleanLead = truncated.slice(0, lastPunctuation + 1);
      } else {
        cleanLead = truncated + "...";
      }
    }

    // 6. Extract Site Name / Brand & English Domain
    let siteName =
      $('meta[property="og:site_name"]').attr("content") ||
      resolvedBaseUrl.hostname.replace(/^www\./, "");

    const domain = resolvedBaseUrl.hostname.replace(/^www\./, "").toLowerCase();

    // 7. Extract Category / Section
    let category =
      $('meta[property="article:section"]').attr("content") ||
      jsonLdCategory ||
      $(".category-name").first().text()?.trim() ||
      "ताजा अपडेट";

    // 8. Extract Published Date
    let publishedDate =
      $('meta[property="article:published_time"]').attr("content") ||
      $('time[datetime]').first().attr("datetime") ||
      jsonLdDate ||
      null;

    return NextResponse.json({
      success: true,
      data: {
        url: resolvedBaseUrl.toString(),
        domain,
        websiteUrl: domain,
        title: cleanTitle,
        lead: cleanLead,
        photoUrl,
        logoUrl,
        siteName,
        category: category.trim(),
        publishedDate,
      },
    });
  } catch (error: any) {
    console.error("News extraction error:", error);
    return NextResponse.json(
      { error: error.message || "समाचार लिङ्कबाट विवरण निकाल्न सकिएन" },
      { status: 500 }
    );
  }
}
