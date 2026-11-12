/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7856ff",
        brand: {
          blue: "#0e4fa3",
          "blue-dark": "#0a3b7a",
          "blue-light": "#eaf2fd",
          gold: "#ffc531",
        },
      },
    },
  },
  plugins: [],
};