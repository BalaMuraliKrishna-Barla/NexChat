module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light Theme Colors
        "light-bg": "#F8FAFC", // slate-50
        "light-surface": "#FFFFFF", // white
        "light-text-primary": "#1E293B", // slate-800
        "light-text-secondary": "#64748B", // slate-500

        // Dark Theme Colors
        "dark-bg": "#0F172A", // slate-900
        "dark-surface": "#1E293B", // slate-800
        "dark-text-primary": "#E2E8F0", // slate-200
        "dark-text-secondary": "#94A3B8", // slate-400

        // Brand & Accent Colors
        "brand-primary": "#4F46E5", // indigo-600
        "brand-secondary": "#38BDF8", // sky-400
      },
    },
  },
  plugins: [],
};
