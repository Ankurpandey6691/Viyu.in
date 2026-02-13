/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Stitch1 Palette
                bgMain: '#0B0B0C',
                cardBg: '#121214',
                borderColor: '#1F1F22',
                primary: '#6366F1', // Indigo
                textMain: '#E2E8F0',
                textMuted: '#71717A',

                // Status Colors (retain from Viyu)
                'viyu-green': '#10b981',
                'viyu-red': '#ef4444',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #1F1F22 1px, transparent 1px), linear-gradient(to bottom, #1F1F22 1px, transparent 1px)",
            }
        },
    },
    plugins: [],
}
