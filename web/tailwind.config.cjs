/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        fire: ["Fira Sans Condensed", "Roboto", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        text: "#E1E1E6",
        title: "#FFF",
        body: "#121414",
        description: "#DBDBDB",
        line: "#29292E",
        highlight: "#61DCFB",
        "link-menu": "#A8A8B3",
        "paragraph-link": "#EBA417",
        "button-text": "#000",
        "button-base": "#EBA417"
      },
      boxShadow: {
        image: "0 8px 24px rgb(0 0 0 / 50%)",
        elevation: "0 1px 2px rgba(0, 0, 0, .9), 0 0 2px rgba(0, 0, 0, .9)"
      },
      animation: {
        show: "show 0.75s ease-in-out forwards",
        grow: "grow 450ms ease-in-out",
        "spin-slow": "spin-slow 1568ms linear infinite", // 2s
        "spin-one-time": "spin 500ms linear",
      },
      keyframes: {
        grow: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" }
        },
        "spin-slow": {
          to: {
            transform: "rotate(360deg)"
          }
        },
      },
    },
    plugins: [],
  }
}
