const { addDynamicIconSelectors } = require('@iconify/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        fontFamily: {
            'sans': ['Roboto'],
            'montserrat': ['Montserrat'],
        },
        extend: {},
    },
    plugins: [
        addDynamicIconSelectors(),
    ],
}