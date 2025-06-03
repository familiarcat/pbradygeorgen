module.exports = {
    theme: {
        extend: {
            animation: {
                "fade-in": "fadeIn 1s ease-out both",
                "pulse-slow": "pulse 2.5s infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: 0, transform: "translateY(8px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                },
            },
        },
    },
    content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
    plugins: [],
};