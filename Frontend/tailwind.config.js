/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        card: "#1E293B",
        accent: {
          start: "#8B5CF6",
          end: "#3B82F6",
        }
      },
      backgroundImage: {
        'gradient-accent': "linear-gradient(to right, #8B5CF6, #3B82F6)",
        'glass': "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",
      },
      boxShadow: {
        'accent-glow': "0 0 20px rgba(139, 92, 246, 0.3)",
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
