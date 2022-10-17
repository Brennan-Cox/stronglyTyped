/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stgray: {
          100: '#424242',
          200: '#2E2E2E',
        },
        mint: '#6CBDA9',
      },
      fontFamily: {
        body: ['Space Mono']
      },
      width: {
        '128': '32rem',
      }
    },
  },
  plugins: [],
}
