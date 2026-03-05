/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#325288',
                secondary: '#f4f6f8',
                accent: '#11a95e',
                danger: '#d9534f',
                warning: '#f0ad4e',
                info: '#5bc0de',
                sidebar: '#223d66'
            }
        },
    },
    plugins: [],
}
