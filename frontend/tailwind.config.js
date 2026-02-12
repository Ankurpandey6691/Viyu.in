/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'viyu-dark': '#0f172a',
                'viyu-card': '#1e293b',
                'viyu-green': '#10b981',
                'viyu-red': '#ef4444',
            }
        },
    },
    plugins: [],
}
