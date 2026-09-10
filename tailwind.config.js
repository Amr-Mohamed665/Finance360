/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      /* ─────────────────────────────────────
         COLORS
      ───────────────────────────────────── */
      colors: {
        // Backgrounds
        bg: {
          primary: "#0b1120",
          secondary: "#111827",
          tertiary: "#1e293b",
          card: "#151e2e",
          sidebar: "#0a0f1c",
          hover: "#1a2435",
        },

        // Brand
        accent: {
          primary: "#6366f1",
          secondary: "#06b6d4",
          "primary-hover": "#818cf8",
        },

        // Financial colors
        income: "#10b981",
        expense: "#f43f5e",
        savings: "#06b6d4",
        warning: "#f59e0b",
        danger: "#ef4444",
        info: "#3b82f6",

        // Borders
        border: {
          DEFAULT: "rgba(148,163,184,0.10)",
          glow: "rgba(99,102,241,0.25)",
          hover: "rgba(148,163,184,0.18)",
        },

        // Text
        text: {
          primary: "#f8fafc",
          secondary: "#cbd5e1",
          muted: "#64748b",
        },
      },

      /* ─────────────────────────────────────
         TYPOGRAPHY
      ───────────────────────────────────── */
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },

      /* ─────────────────────────────────────
         BORDER RADIUS
      ───────────────────────────────────── */
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
      },

      /* ─────────────────────────────────────
         SHADOWS
      ───────────────────────────────────── */
      boxShadow: {
        sm: "0 2px 8px rgba(0,0,0,0.20)",
        md: "0 8px 30px rgba(0,0,0,0.30)",
        lg: "0 16px 40px rgba(0,0,0,0.40)",
        glow: "0 0 20px rgba(99,102,241,0.20)",
        "glow-cyan": "0 0 20px rgba(6,182,212,0.20)",
        "glow-income": "0 0 20px rgba(16,185,129,0.18)",
        "glow-expense": "0 0 20px rgba(244,63,94,0.18)",
        "card-hover":
          "0 16px 40px rgba(0,0,0,0.35), 0 0 25px rgba(99,102,241,0.12)",
      },

      /* ─────────────────────────────────────
         BACKGROUND GRADIENTS
      ───────────────────────────────────── */
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
        "gradient-accent": "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
        "gradient-dark": "linear-gradient(180deg, #111827 0%, #0b1120 100%)",
        "gradient-card": "linear-gradient(145deg, #151e2e 0%, #101827 100%)",
        "gradient-income": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        "gradient-expense": "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
        "gradient-savings": "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
        "gradient-balance": "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
        "gradient-budget": "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      },

      /* ─────────────────────────────────────
         ANIMATIONS
      ───────────────────────────────────── */
      keyframes: {
        float: {
          "0%, 100%": {
            transform: "translateY(0) scale(1)",
          },
          "50%": {
            transform: "translateY(-20px) scale(1.05)",
          },
        },

        "fade-in": {
          from: {
            opacity: "0",
            transform: "translateY(8px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        "slide-up": {
          from: {
            opacity: "0",
            transform: "translateY(20px) scale(0.97)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },

        "spin-slow": {
          to: {
            transform: "rotate(360deg)",
          },
        },

        shimmer: {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
      },

      animation: {
        float: "float 8s ease-in-out infinite",
        "float-rev": "float 6s ease-in-out infinite reverse",
        "float-lg": "float 10s ease-in-out infinite",
        "fade-in": "fade-in 0.25s cubic-bezier(0.4,0,0.2,1) both",
        "slide-up": "slide-up 0.3s cubic-bezier(0.4,0,0.2,1) both",
        "spin-slow": "spin-slow 1s linear infinite",
        shimmer: "shimmer 2s linear infinite",
      },

      /* ─────────────────────────────────────
         TRANSITIONS
      ───────────────────────────────────── */
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4,0,0.2,1)",
      },

      /* ─────────────────────────────────────
         BACKDROP
      ───────────────────────────────────── */
      backdropBlur: {
        card: "12px",
      },
    },
  },

  plugins: [],
};
