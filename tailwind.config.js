/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        'outfit-md': ['Outfit-Medium', 'sans-serif'],
        'outfit-sb': ['Outfit-SemiBold', 'sans-serif'],
        'outfit-b': ['Outfit-Bold', 'sans-serif'],
        'work-sans': ['WorkSans', 'sans-serif'],
        'work-sans-md': ['WorkSans-Medium', 'sans-serif'],
        'work-sans-sb': ['WorkSans-SemiBold', 'sans-serif'],
        'work-sans-b': ['WorkSans-Bold', 'sans-serif'],
      },
      colors: {
        background: "#F0F9FF",
        foreground: "#0C4A6E",
        primary: {
          DEFAULT: "#0369A1",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#0EA5E9",
          foreground: "#ffffff",
        },
        cta: {
          DEFAULT: "#22C55E",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0C4A6E",
        },
        muted: {
          DEFAULT: "#e0f2fe",
          foreground: "#0284c7",
        },
        border: "#bae6fd",
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 6px rgba(0,0,0,0.1)',
        lg: '0 10px 15px rgba(0,0,0,0.1)',
        xl: '0 20px 25px rgba(0,0,0,0.15)',
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
