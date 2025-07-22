/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'iopeer': {
          50: '#f0f4ff',
          100: '#e0e7ff',
          500: '#667eea',
          600: '#5a67d8',
        }
      },
    },
  },
  plugins: [],
}
