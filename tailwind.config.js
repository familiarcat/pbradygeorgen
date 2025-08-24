/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        dynamic: {
          primary: "var(--dynamic-primary)",
          secondary: "var(--dynamic-secondary)",
          accent: "var(--dynamic-accent)",
          background: "var(--dynamic-background)",
          text: "var(--dynamic-text)",
          border: "var(--dynamic-border)",
        },
        cta: {
          primary: "var(--cta-primary)",
          secondary: "var(--cta-secondary)",
          tertiary: "var(--cta-tertiary)",
        },
      },
      fontFamily: {
        sans: "var(--font-sans)",
        heading: "var(--font-heading)",
        mono: "var(--font-mono)",
        serif: "var(--font-serif)",
      },
    },
  },
  plugins: [],
};
