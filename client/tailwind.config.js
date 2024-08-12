module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "media", // or 'class'
  theme: {
    extend: {
      fontFamily: {
        billabong: ["Dancing Script", "cursive"],
        proxima: ["Poppins", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
