/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // Safelist specific dynamic classes
    "text-red-200",
    "bg-green-500",
    "w-[100px]",
    { pattern: /^text-/ },
    { pattern: /^bg-/ },
    { pattern: /^border-/ },
    // { pattern: /^w-/ },
    // { pattern: /^h-/ },
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "7xl": "2400px",
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
