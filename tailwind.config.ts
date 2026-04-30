import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-error": "#690005",
        "surface-container": "#1f1f24",
        "surface-container-high": "#292a2e",
        "on-primary-fixed": "#002022",
        "inverse-on-surface": "#2f3035",
        "surface": "#121317",
        "on-secondary-container": "#d5b5ff",
        "surface-container-highest": "#343439",
        "tertiary-fixed-dim": "#b3c5ff",
        "primary-fixed-dim": "#00dbe9",
        "error": "#ffb4ab",
        "on-surface": "#e3e2e8",
        "inverse-surface": "#e3e2e8",
        "on-primary-fixed-variant": "#004f54",
        "surface-bright": "#38393e",
        "surface-dim": "#121317",
        "secondary-container": "#6e06d0",
        "on-secondary-fixed-variant": "#6200bc",
        "tertiary-container": "#ced8ff",
        "outline-variant": "#3b494b",
        "on-primary": "#00363a",
        "primary-container": "#00f0ff",
        "inverse-primary": "#006970",
        "on-primary-container": "#006970",
        "secondary-fixed-dim": "#d8b9ff",
        "primary": "#dbfcff",
        "on-surface-variant": "#b9cacb",
        "on-tertiary-fixed-variant": "#003fa4",
        "on-secondary": "#450086",
        "on-tertiary": "#002b75",
        "background": "#121317",
        "surface-container-low": "#1a1b20",
        "on-background": "#e3e2e8",
        "on-tertiary-container": "#0055d6",
        "secondary-fixed": "#eddcff",
        "primary-fixed": "#7df4ff",
        "surface-variant": "#343439",
        "on-error-container": "#ffdad6",
        "secondary": "#d8b9ff",
        "surface-container-lowest": "#0d0e12",
        "error-container": "#93000a",
        "on-tertiary-fixed": "#001849",
        "on-secondary-fixed": "#290055",
        "surface-tint": "#00dbe9",
        "outline": "#849495",
        "tertiary-fixed": "#dae1ff",
        "tertiary": "#f5f5ff"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "margin": "40px",
        "gutter": "24px",
        "container-max": "1440px",
        "unit": "4px"
      },
      fontFamily: {
        "body-lg": ["var(--font-inter)"],
        "label-caps": ["var(--font-inter)"],
        "headline-lg": ["var(--font-space-grotesk)"],
        "body-md": ["var(--font-inter)"],
        "headline-md": ["var(--font-space-grotesk)"],
        "display-xl": ["var(--font-space-grotesk)"]
      },
      fontSize: {
        "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "label-caps": ["12px", { "lineHeight": "1.0", "letterSpacing": "0.1em", "fontWeight": "700" }],
        "headline-lg": ["32px", { "lineHeight": "1.2", "fontWeight": "600" }],
        "body-md": ["16px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "headline-md": ["24px", { "lineHeight": "1.3", "fontWeight": "600" }],
        "display-xl": ["48px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700" }]
      },
      boxShadow: {
        card: "0 24px 80px rgba(0, 0, 0, 0.45)",
        glow: "0 0 24px rgba(0, 240, 255, 0.18)",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
