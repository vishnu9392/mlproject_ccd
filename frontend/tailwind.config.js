/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        glass: "0 20px 60px rgba(0,0,0,0.20)",
      },
      colors: {
        brandPrimary: "#539B77",
        brandSecondary: "#C0DD73",
      },
    },
  },
  plugins: [],
};

