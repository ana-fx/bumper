module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // New structured color system
        primary: "#E05C7F", // Pink
        secondary: "#374151", // Dark gray
        accent: "#8468CE", // Purple
        
        // Anime theme colors (for backward compatibility)
        'anime-blue': '#4D7FE3',
        'anime-pink': '#E05C7F',
        'anime-purple': '#8468CE',
        'anime-dark': '#1A1A2E',
        
        // Additional color variations
        'primary-light': '#F472B6',
        'primary-dark': '#BE185D',
        'secondary-light': '#6B7280',
        'secondary-dark': '#1F2937',
        'accent-light': '#A78BFA',
        'accent-dark': '#7C3AED',
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        'nunito': ['Nunito', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 