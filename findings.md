# Findings & Decisions

## Requirements
- Maintain and enhance **Simple News Card Studio**
- Provide live visual editing and canvas-based high-res news card generation
- Support multilingual typography (Nepali Unicode, English)
- Support multiple aspect ratios (4:5 Portrait, 1:1 Square, 16:9 Landscape, 9:16 Story/Reel)
- Maintain authentication (admin/editor roles), user management, and session cookies
- Enable automated news article extraction and image proxying to avoid CORS taint

## Architecture & Codebase Discovery

### Core Tech Stack
- **Framework**: Next.js 14.2.5 (App Router, TypeScript)
- **Styling**: Tailwind CSS 3.4.7 + Custom CSS
- **Icons**: Lucide React
- **Scraping / Parsing**: Cheerio (for automated headline, lead text & image extraction from online news portals)
- **Rendering Engine**: Pure HTML5 2D Canvas API (`lib/canvasRenderer.ts`)

### Project Structure & Component Mapping
- [`app/page.tsx`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/app/page.tsx): Main studio workbench; handles auth gate, state coordination, image uploads, URL scrapers, and export triggers.
- [`app/layout.tsx`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/app/layout.tsx): Root layout with Nepali & Google web fonts preloaded.
- [`app/login/page.tsx`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/app/login/page.tsx): Login portal with session authentication.
- [`components/SidebarControls.tsx`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/components/SidebarControls.tsx): Multi-tab sidebar controls:
  - Presets & Quick Themes
  - Text & Headline typography (Fonts, alignments, highlight markers, offsets)
  - Category / Issue Tag & Nepali Date (Bikram Sambat conversion via `lib/nepaliDate.ts`)
  - Photo adjustments (Zoom, pan offsets, filters, borders)
  - Branding (Logo upload/position, Ad sponsor banner)
  - Panel styling (Textures, gradients, accent bars, CTA)
  - News Extractor tab (URL scraper input)
- [`components/CanvasPreview.tsx`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/components/CanvasPreview.tsx): Responsive interactive canvas viewport with zoom controls, pan navigation, and drag-to-reposition photo support.
- [`components/Navbar.tsx`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/components/Navbar.tsx): Header with quick actions, aspect ratio picker, user profile, password reset modal trigger, and export buttons.
- [`components/AdminUsersModal.tsx`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/components/AdminUsersModal.tsx): Admin user management interface (create, update roles, reset password, delete users).
- [`components/ChangePasswordModal.tsx`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/components/ChangePasswordModal.tsx): User self-service password change modal.

### Backend APIs
- [`app/api/auth/login`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/app/api/auth/login/route.ts): Authenticates user against `data/users.json` and issues JWT/Session cookie.
- [`app/api/auth/logout`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/app/api/auth/logout/route.ts): Clears session cookie.
- [`app/api/auth/me`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/app/api/auth/me/route.ts): Verifies current session cookie and returns user metadata.
- [`app/api/auth/change-password`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/app/api/auth/change-password/route.ts): Password update handler with hashing.
- [`app/api/admin/users`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/app/api/admin/users): CRUD operations for user accounts (Admin only).
- [`app/api/extract-news`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/app/api/extract-news/route.ts): Scrapes metadata (og:title, og:image, description, date) from news URLs using Cheerio.
- [`app/api/proxy-image`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/app/api/proxy-image/route.ts): Streams remote image binary data to bypass browser CORS restrictions during canvas rendering.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| **HTML5 Canvas 2D Engine** | Avoids DOM-to-image/html2canvas distortion, ensures exact font rendering and high-DPI export quality (1080x1350, 1080x1080, 1920x1080, 1080x1920). |
| **Image Proxy API** | Eliminates Canvas security `tainted` errors when exporting graphics that include photos from external news websites. |
| **Bikram Sambat (BS) Engine** | Built-in Nepali calendar algorithm converts Gregorian dates to Nepali dates with custom formatting indices. |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| CTA (Call To Action) not visible in right preview area | **Root cause:** The grandparent flex column container in `CanvasPreview.tsx` (`<main>`) had insufficient height deduction in `updateScale` (`clientHeight - 80`), while the floating toolbar + padding + margins took ~120px. Flexbox applied `flex-shrink: 1` to the canvas wrapper, reducing its height below `targetH * scale`. The wrapper's `overflow: hidden` then clipped the bottom 28-50px containing the CTA bar. **Fix:** Increase container height deduction to 130px+, add `flex-shrink-0` and explicit `min-height`/`min-width` to the wrapper, add `ResizeObserver`, and ensure the left slogan text on the CTA bar never overflows into the right website pill. |

## Resources
- Package manifest: [`package.json`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/package.json)
- Renderer core: [`lib/canvasRenderer.ts`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/lib/canvasRenderer.ts)
- Date converter: [`lib/nepaliDate.ts`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/lib/nepaliDate.ts)
- Database utility: [`lib/db.ts`](file:///d:/AI%20Made%20Project/Simple%20News%20Card/lib/db.ts)
