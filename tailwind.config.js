/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        roboto: ['var(--font-roboto)', 'sans-serif'],
        merriweather: ['var(--font-merriweather)', 'serif'],
        sourceSans: ['var(--font-source-sans)', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#b8452e',
          light: '#e06a53',
          dark: '#8c2f1e',
        },
        secondary: {
          DEFAULT: '#339944',
          light: '#4ac456',
          dark: '#267733',
        },
        accent: {
          DEFAULT: '#268ed9',
          light: '#4ba8e6',
          dark: '#1c6ca3',
        },
        background: {
          DEFAULT: '#f4f2f1',
          dark: '#2c2521',
        },
        text: {
          DEFAULT: '#2c2521',
          light: '#f4f2f1',
        },
      },
    },
  },
  plugins: [],
};
