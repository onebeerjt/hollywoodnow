import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#18181b",
          paper: "#fafaf9",
          accent: "#2563eb"
        }
      }
    }
  },
  plugins: []
};

export default config;
