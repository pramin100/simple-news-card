import type { Metadata } from "next";
import {
  Inter,
  Noto_Sans_Devanagari,
  Noto_Serif_Devanagari,
  Mukta,
  Baloo_2,
  Hind,
  Khand,
  Anek_Devanagari,
  Teko,
  Rozha_One,
  Yatra_One,
} from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSans = Noto_Sans_Devanagari({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["devanagari", "latin"],
  variable: "--font-noto-sans-devanagari",
});
const notoSerif = Noto_Serif_Devanagari({
  weight: ["400", "600", "700", "900"],
  subsets: ["devanagari", "latin"],
  variable: "--font-noto-serif-devanagari",
});
const mukta = Mukta({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["devanagari", "latin"],
  variable: "--font-mukta",
});
const baloo2 = Baloo_2({
  weight: ["400", "600", "700", "800"],
  subsets: ["devanagari", "latin"],
  variable: "--font-baloo-2",
});
const hind = Hind({
  weight: ["400", "500", "600", "700"],
  subsets: ["devanagari", "latin"],
  variable: "--font-hind",
});
const khand = Khand({
  weight: ["400", "500", "600", "700"],
  subsets: ["devanagari", "latin"],
  variable: "--font-khand",
});
const anek = Anek_Devanagari({
  weight: ["400", "600", "700", "800"],
  subsets: ["devanagari", "latin"],
  variable: "--font-anek-devanagari",
});
const teko = Teko({
  weight: ["400", "500", "600", "700"],
  subsets: ["devanagari", "latin"],
  variable: "--font-teko",
});
const rozhaOne = Rozha_One({
  weight: ["400"],
  subsets: ["devanagari", "latin"],
  variable: "--font-rozha-one",
});
const yatraOne = Yatra_One({
  weight: ["400"],
  subsets: ["devanagari", "latin"],
  variable: "--font-yatra-one",
});

export const metadata: Metadata = {
  title: "Nepali News Card Maker — सामाजिक सञ्जाल समाचार कार्ड मेकर",
  description: "Create stunning Nepali news cards and posters for Facebook, Instagram, Twitter and TikTok social media sharing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ne" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Anek+Devanagari:wght@400;600;700;800&family=Baloo+2:wght@400;600;700;800&family=Hind:wght@400;600;700&family=Khand:wght@400;600;700&family=Mukta:wght@400;600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700;900&family=Noto+Serif+Devanagari:wght@400;700;900&family=Rozha+One&family=Teko:wght@400;600;700&family=Yatra+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${notoSans.variable} ${notoSerif.variable} ${mukta.variable} ${baloo2.variable} ${hind.variable} ${khand.variable} ${anek.variable} ${teko.variable} ${rozhaOne.variable} ${yatraOne.variable} font-sans min-h-full bg-slate-100 text-slate-900 antialiased selection:bg-brand-500 selection:text-white`}
      >
        {/* Hidden font preloader container so canvas always measures with real loaded fonts */}
        <div
          aria-hidden="true"
          className="absolute -top-[9999px] -left-[9999px] opacity-0 pointer-events-none text-2xl font-bold"
        >
          <span style={{ fontFamily: "Noto Serif Devanagari" }}>देवनागरी अक्षर परीक्षण ०१२३४५६७८९</span>
          <span style={{ fontFamily: "Mukta" }}>देवनागरी अक्षर परीक्षण ०१२३४५६७८९</span>
          <span style={{ fontFamily: "Baloo 2" }}>देवनागरी अक्षर परीक्षण ०१२३४५६७८९</span>
          <span style={{ fontFamily: "Noto Sans Devanagari" }}>देवनागरी अक्षर परीक्षण ०१२३४५६७८९</span>
          <span style={{ fontFamily: "Hind" }}>देवनागरी अक्षर परीक्षण ०१२३४५६७८९</span>
          <span style={{ fontFamily: "Khand" }}>देवनागरी अक्षर परीक्षण ०१२३४५६७८९</span>
          <span style={{ fontFamily: "Anek Devanagari" }}>देवनागरी अक्षर परीक्षण ०१२३४५६७८९</span>
          <span style={{ fontFamily: "Teko" }}>देवनागरी अक्षर परीक्षण ०१२३४५६७८९</span>
          <span style={{ fontFamily: "Rozha One" }}>देवनागरी अक्षर परीक्षण ०१२३४५६७८९</span>
          <span style={{ fontFamily: "Yatra One" }}>देवनागरी अक्षर परीक्षण ०१२३४५६७८९</span>
        </div>
        {children}
      </body>
    </html>
  );
}
