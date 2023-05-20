/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  mode: "jit",

  theme: {
    extend: {
      colors: {
        "main-green": "#64FFDB",
        "main-blue": "#0A192F",
        // main-blue: "#272E39"
        // nav: "#2A333E"
        // nav-light: "#333D49"

        "secondary-gray": "#172A46",
        // "dark-gray": "#333D49",
        // "dark-gray-btn": "#353534",

        "bg-grey": "#0C0A1D",
        "bg-dgrey": "#0C0A1D",
        "bg-secondary-grey": "#0C0C0C",
        "grey-line": "#333333",
        "primary-orange": "#64FFDB",
        "primary-white": "#F9F9F9",
        "secondary-white": "#3BC8EA",
        "primary-mint": "#3BC8EA",
        "button-text-black": "#0C0C0C",
        "text-secondary-gray": "#A8A8A8",
      },
    },
  },
  plugins: [],
};
