/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7fc",
          100: "#e0eef8",
          200: "#c7def1",
          300: "#9ec4e5",
          400: "#6ea5d5",
          500: "#4987c4",
          600: "#366ca9",
          700: "#2d5689",
          800: "#1a6fad",
          900: "#0e4f82",
          950: "#0b2f51",
        },
        accent: {
          orange: "#ff6b00",
          crimson: "#c0392b",
          gold: "#f59e0b",
          emerald: "#10b981",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-noto-sans-devanagari)", "sans-serif"],
        serif: ["var(--font-noto-serif-devanagari)", "serif"],
        mukta: ["var(--font-mukta)", "sans-serif"],
        baloo: ["var(--font-baloo-2)", "sans-serif"],
        hind: ["var(--font-hind)", "sans-serif"],
        khand: ["var(--font-khand)", "sans-serif"],
        anek: ["var(--font-anek-devanagari)", "sans-serif"],
        teko: ["var(--font-teko)", "sans-serif"],
        rozha: ["var(--font-rozha-one)", "serif"],
        yatra: ["var(--font-yatra-one)", "serif"],
      },
    },
  },
  plugins: [],
};
