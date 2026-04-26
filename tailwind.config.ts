import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbf7",
          100: "#d5f5ea",
          200: "#abe9d5",
          300: "#74d7b8",
          400: "#42bb95",
          500: "#229978",
          600: "#1a7a62",
          700: "#175f4e",
          800: "#164d41",
          900: "#133f36"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(34,153,120,0.18), transparent 30%), linear-gradient(to bottom, rgba(248,250,252,1), rgba(236,253,245,1))"
      }
    }
  },
  plugins: []
};

export default config;
