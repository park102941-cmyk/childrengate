/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0071e3",
        "primary-hover": "#0077ed",
        secondary: "#424245",
        success: "#28cd41",
        warning: "#ffcc00",
        error: "#ff3b30",
      },
      borderRadius: {
        'apple': '14px',
        'apple-lg': '24px',
      },
    },
  },
  plugins: [],
};
