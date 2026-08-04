import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        primary: {
          DEFAULT: "#E10600",
          foreground: "#FFFFFF",
          50: "#FFECEC",
          100: "#FFD6D4",
          200: "#FFABA6",
          300: "#FF7A72",
          400: "#F53D33",
          500: "#E10600",
          600: "#B80500",
          700: "#8F0400",
          800: "#660300",
          900: "#3D0200",
        },
        "brand-teal": {
          DEFAULT: "#14B8A6",
          foreground: "#042F2E",
        },
        secondary: {
          DEFAULT: "#111111",
          foreground: "#FFFFFF",
          50: "#F5F5F5",
          100: "#E5E5E5",
          200: "#CCCCCC",
          300: "#999999",
          400: "#666666",
          500: "#444444",
          600: "#2A2A2A",
          700: "#1A1A1A",
          800: "#111111",
          900: "#0A0A0A",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.45)",
        "glass-lg": "0 16px 48px rgba(0, 0, 0, 0.55)",
        premium: "0 24px 80px rgba(0, 0, 0, 0.55)",
        glow: "0 0 20px rgba(225, 6, 0, 0.4)",
        "glow-lg": "0 0 36px rgba(225, 6, 0, 0.55)",
      },
      backdropBlur: {
        glass: "16px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(to right, rgba(17,17,17,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.06) 1px, transparent 1px)",
        "brand-radial":
          "radial-gradient(ellipse at top, rgba(225,6,0,0.18), transparent 55%)",
      },
    },
  },
  plugins: [
    animate,
    function glassUtilities({
      addUtilities,
    }: {
      addUtilities: (utilities: Record<string, Record<string, string>>) => void;
    }) {
      addUtilities({
        ".glass": {
          background: "rgba(12, 12, 12, 0.82)",
          "backdrop-filter": "blur(18px)",
          "-webkit-backdrop-filter": "blur(18px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          "box-shadow": "0 24px 80px rgba(0, 0, 0, 0.55)",
        },
        ".glass-dark": {
          background: "rgba(10, 10, 10, 0.9)",
          "backdrop-filter": "blur(20px)",
          "-webkit-backdrop-filter": "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          "box-shadow": "0 24px 80px rgba(0, 0, 0, 0.6)",
        },
        ".glass-subtle": {
          background: "rgba(17, 17, 17, 0.55)",
          "backdrop-filter": "blur(12px)",
          "-webkit-backdrop-filter": "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        },
        ".glass-strong": {
          background: "rgba(8, 8, 8, 0.88)",
          "backdrop-filter": "blur(24px)",
          "-webkit-backdrop-filter": "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          "box-shadow": "0 24px 80px rgba(0, 0, 0, 0.55)",
        },
      });
    },
  ],
};

export default config;
