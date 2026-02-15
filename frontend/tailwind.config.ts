import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        brand: {
          blue: "rgb(var(--brand-blue) / <alpha-value>)",
          red: "rgb(var(--brand-red) / <alpha-value>)"
        },
        accent: {
          yellow: "rgb(var(--accent-yellow) / <alpha-value>)",
          pink: "rgb(var(--accent-pink) / <alpha-value>)"
        },
        card: "rgb(var(--card) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.10)"
      }
    }
  },
  plugins: []
};

export default config;

