const withMT = require("@material-tailwind/react/utils/withMT");

const config = withMT({
    content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        colors: {
            white: "#FFFFFF",
            black: "#242424",
            grey: "#F3F3F3",
            "dark-grey": "#6B6B6B",
            red: "#FF4E4E",
            transparent: "transparent",
            twitter: "#1DA1F2",
            purple: "#8B46FF",
        },
        fontSize: {
            sm: "12px",
            base: "14px",
            xl: "16px",
            "2xl": "20px",
            "3xl": "28px",
            "4xl": "38px",
            "5xl": "50px",
        },
        extend: {
            fontFamily: {
                "gt-super": ["GT Super", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
                monospace: ["monospace"],
                inter: ["'Inter'", "sans-serif"],
                gelasio: ["'Gelasio'", "serif"],
            },
        },
    },
    plugins: [],
});

export default config;
