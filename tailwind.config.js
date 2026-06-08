/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",
        foreground: "#f8fafc",
        card: "rgba(30, 41, 59, 0.7)",
        border: "rgba(148, 163, 184, 0.2)",
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
