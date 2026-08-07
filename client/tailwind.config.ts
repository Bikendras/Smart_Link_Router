import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7f1",
          100: "#dceee0",
          200: "#bbddc3",
          300: "#8cc49a",
          400: "#5aa56d",
          500: "#3d8a52",
          600: "#2d6a3e",
          700: "#265635",
          800: "#21452c",
          900: "#1c3926",
          950: "#0e1f14",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(15, 40, 20, 0.08)",
        card: "0 4px 24px rgba(15, 40, 20, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
