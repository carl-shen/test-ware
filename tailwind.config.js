/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-dark-gray": "#202021",
        "dark-darker-gray": "#191920",
        "link-text-blue": "#007BFF",
      },
    },
  },
  plugins: [],
};
