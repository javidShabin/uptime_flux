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
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "slide-left": "slideLeft 1.2s ease-out forwards",
        "slide-right": "slideRight 1.2s ease-out forwards",
        "float-slow": "floatSlow 6s ease-in-out infinite",
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "gradient": "gradient 3s ease infinite",
        "pulse-slow": "pulseSlow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
