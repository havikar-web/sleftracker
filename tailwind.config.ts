import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        physics: {
          DEFAULT: "#3b82f6",
          dark: "#1d4ed8",
          light: "#dbeafe",
          text: "#2563eb"
        },
        chemistry: {
          DEFAULT: "#10b981",
          dark: "#047857",
          light: "#d1fae5",
          text: "#059669"
        },
        maths: {
          DEFAULT: "#f43f5e",
          dark: "#be123c",
          light: "#ffe4e6",
          text: "#e11d48"
        },
        biology: {
          DEFAULT: "#a855f7",
          dark: "#7e22ce",
          light: "#f3e8ff",
          text: "#9333ea"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "monospace"],
        sans: ["var(--font-geist-sans)", "-apple-system", "BlinkMacSystemFont", "Inter", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
