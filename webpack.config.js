/**
 * 功能：
 * 作者：zhoujingchun
 * 日期：
 */


const path = require("path")
const RunPlugin = require('./plugins/run-plugin')
const DonePlugin = require('./plugins/done-plugin')

module.exports = {
    mode: 'development',
    entry: "./src/index.js",
    resolve: {
        extensions: [".js"]
    },
    module: {
        rules: [

            {
                test: /\.js$/,
                use: [
                    path.resolve(__dirname, "loaders", "logger1-loader.js"), //
                    path.resolve(__dirname, "loaders", "logger2-loader.js"),
                ]
            }
        ]
    },
    plugins: [
        new RunPlugin(),
        new DonePlugin(),
    ]
}