const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/entry.js",
  output: {
    filename: "entry.js",
    path: path.resolve(__dirname, "build"),
    assetModuleFilename: "src/assets/images/[name][ext]",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        exclude: [require.resolve("./index.html")],
        use: {
          loader: "html-loader",
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpg)$/i,
        type: "asset/resource",
      },
    ],
  },

  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 3000,
    hot: true,
  },
};
