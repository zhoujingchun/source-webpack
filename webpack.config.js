/**
 * 功能：
 * 作者：zhoujingchun
 * 日期：
 */

const path = require("path");
const RunPlugin = require("./plugins/run-plugin");
const DonePlugin = require("./plugins/done-plugin");

module.exports = {
  mode: "development",
  entry: {
    entry1: "./src/index1.js",
    entry2: "./src/index2.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          path.resolve(__dirname, "loaders", "logger1-loader.js"), //
          path.resolve(__dirname, "loaders", "logger2-loader.js"),
        ],
      },
    ],
  },
  plugins: [new RunPlugin(), new DonePlugin()],
};
