# Task Plan: Simple News Card Studio Project Management

## Goal
Maintain, optimize, and expand the Simple News Card Studio web application — a high-performance Next.js and HTML5 Canvas-based Nepali/multilingual news card generator with user management, news scrapers, and dynamic styling controls.

## Current Phase
Phase 1: Project Initialization & Knowledge Base Setup

## Phases

### Phase 1: Requirements & Discovery
- [x] Analyze codebase structure (Next.js 14 App Router, Canvas renderer, API routes, Auth)
- [x] Initialize persistent scratchpad tracking files (`task_plan.md`, `findings.md`, `progress.md`)
- [x] Document system architecture, components, and dependencies in `findings.md`
- **Status:** complete

### Phase 2: System Health & Baseline Verification
- [x] Verify dependencies and build status (`npx tsc --noEmit` passed with 0 errors)
- [x] Inspect API endpoints (/api/auth, /api/admin, /api/extract-news, /api/proxy-image)
- [x] Check Canvas rendering pipeline and font loading support
- **Status:** complete

### Phase 3: Feature Planning & Enhancement
- [x] Identify CTA visibility issue in the right canvas preview area
- [x] Discover root cause: parent flex container shrinks canvas wrapper causing `overflow: hidden` to clip bottom 28-50px (where CTA bar resides)
- [x] Plan responsive scaling fix in `CanvasPreview.tsx` and overflow protection in `lib/canvasRenderer.ts`
- **Status:** complete

### Phase 4: Implementation & Iterative Development
- [x] Update `components/CanvasPreview.tsx` to use `ResizeObserver`, proper height allowance (130px+), `flex-shrink-0`, and `min-height`
- [x] Enhance `lib/canvasRenderer.ts` CTA rendering to prevent text overlap between left slogan and right website pill
- [x] Test in browser across 4:5, 1:1, 16:9, and 9:16 aspect ratios
- **Status:** complete

### Phase 5: Verification & Delivery
- [x] Test across multiple aspect ratios (4:5, 1:1, 16:9, 9:16)
- [x] Verify visual appearance and high-res export correctness
- [x] Document resolution in `progress.md` and deliver to user
- **Status:** complete

## Key Questions
1. What specific new features, design improvements, or fixes does the user want to proceed with next?
2. Are there specific scraper targets or Canvas presets that need updating?

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Use `planning-with-files` pattern | Provides persistent context across sessions via disk-backed markdown files |
| Native HTML5 Canvas rendering | Delivers pixel-perfect image exports with no client-side DOM screenshot quirks |
| Local JSON user database (`users.json`) | Lightweight, zero-dependency persistence suitable for internal newsroom tool |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| None currently | - | - |

## Notes
- Update phase status as work proceeds: `pending` → `in_progress` → `complete`.
- Re-read plan before major architectural decisions.
- Log all errors and test results in `progress.md`.
