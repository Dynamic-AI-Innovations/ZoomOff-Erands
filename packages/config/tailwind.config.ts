import type { Config } from "tailwindcss";

const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#F7C438",
          "gold-dark": "#D4A820",
          "gold-light": "#FAD660",
          charcoal: "#2B2B2B",
          "charcoal-light": "#3D3D3D",
        },
        zo: {
          "bg-light": "#F5F5F5",
          "bg-dark": "#0A0A0A",
          success: "#2E7D32",
          "success-light": "#E8F5E9",
          warning: "#E65100",
          "warning-light": "#FFF3E0",
          error: "#C62828",
          "error-light": "#FFEBEE",
          info: "#1565C0",
          "info-light": "#E3F2FD",
          muted: "#6B7280",
          border: "#E5E7EB",
          "border-dark": "#374151",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 12px 0 rgba(0,0,0,0.12)",
        modal: "0 20px 60px -10px rgba(0,0,0,0.3)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.25s ease-out",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(247,196,56,0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(247,196,56,0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
