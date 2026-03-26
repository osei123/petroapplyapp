/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#171717",
        primary: {
          DEFAULT: "#0ea5e9", // Matched with Admin primary cyan/blue
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#171717",
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b",
        },
        border: "#e2e8f0",
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        'full': '9999px',
      }
    },
  },
  plugins: [],
}
