/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: "#635fc7",
      "hover-primary": "#a8a4ff",
      secondary: "#f0effa",
      "hover-secondary": "#d8d7f1",
      danger: "#ea5555",
      "hover-danger": "#ff9898",
      white: "#fff",
      black: "#000112",
      body: "#828fa3",
      shadow: "rgba(54, 78, 126, 0.1)",
      light: "#f4f7fd",
      dark: "#20212c",
      "light-blue": "#e9effa",
      placeholder: "rgba(0, 1, 18, 0.25)",
      overlay: "rgba(32, 33, 44, 0.5)",
      transparent: "transparent",
    },
    extend: {
      fontFamily: {
        sans: [
          "var(--font-plus-jakarta-sans)",
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
