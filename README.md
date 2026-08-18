# 🇳🇵 Nepali News Card Studio (सामाजिक सञ्जाल समाचार कार्ड मेकर)

A modern, high-performance web application to generate professional social media news cards and posters for Nepali digital media, news portals, and content creators.

---

## ✨ Features

- **📰 Aspect Ratios**: 4:5 Portrait (Instagram/Facebook), 1:1 Square, 16:9 Link Preview, and 9:16 Story.
- **⚡ AI URL Auto-Fill & Scraping Engine**: Automatically extracts news headline, summary, featured photo, logo, category, and English domain from online news portals (Onlinekhabar, Setopati, Ratopati, Kantipur, etc.).
- **📅 Accurate Nepali Date (Bikram Sambat)**: 100% official Bikram Sambat date conversion engine (`२०८३ भदौ २, मंगलबार`) with multiple customizable formats and styling.
- **🎨 Rich Typography & Formatting**: Full support for Devanagari fonts (Noto Serif, Mukta, Baloo 2, Hind, Khand, Rozha One, etc.) with custom font size, text alignment, and word highlighting (`*शब्द*`).
- **🛡️ Company / Brand Logo**: Circular or rounded brand badge positioned at the bottom-center of the photo with subtle drop shadows and border rings.
- **🔳 Card Outer Corners**: Customizable corners (Sharp 90-degree rectangle, Soft Rounded, Full Rounded, or Custom Slider).
- **🎛️ Vertical Quick-Controls Tool Strip**: Real-time viewport zooming, photo panning/zooming, and Fullscreen HD preview.
- **⬇️ High-Definition Export**: Download ultra-sharp PNG or JPEG files or copy directly to clipboard.
- **🔐 Secure Authentication & Multi-User Management**: Role-based access control (Admin, Editor, User) with password hashing and session cookies.

---

## 🚀 Getting Started

### 1. Installation

```bash
git clone <your-repo-url>
cd "Simple News Card"
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Default Admin Account

- **Username**: `admin`
- **Password**: `admin123`

*(You can change your password or add new users from the "प्रयोगकर्ता व्यवस्थापन" admin panel in the app)*

---

## 🌐 Deploying to Vercel

1. Push this repository to **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Nepali News Card Studio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Go to [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset will be automatically detected as **Next.js**.
5. Click **"Deploy"**.

---

## 🛠️ Built With

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/)
- **Canvas Engine**: HTML5 2D Canvas with sub-pixel rendering & typography wrapping
- **Scraper**: Cheerio HTML parser with metadata extraction
- **Date Converter**: `nepali-date-converter` (Bikram Sambat official calendar)
