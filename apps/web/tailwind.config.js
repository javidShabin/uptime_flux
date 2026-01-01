/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
     keyframes: {
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(-120px) skewX(-20deg)" },
          "100%": { opacity: "1", transform: "translateX(0) skewX(-20deg)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(120px) skewX(20deg)" },
          "100%": { opacity: "1", transform: "translateX(0) skewX(20deg)" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "slide-left": "slideLeft 1.2s ease-out forwards",
        "slide-right": "slideRight 1.2s ease-out forwards",
        "float-slow": "floatSlow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
