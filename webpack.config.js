const path = require("path");

module.exports = {
    mode: "none",
    entry: {
        TechBabee: "./src/main.ts",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    // optimization: {
    //     splitChunks: {
    //         // include all types of chunks
    //         chunks: "all",
    //     },
    // },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        library: "[name]",
        libraryTarget: "var",
    },
};
