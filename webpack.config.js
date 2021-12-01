/**
 * 功能：
 * 作者：zhoujingchun
 * 日期：
 */


const path = require("path")
const RunPlugin = require('./plugins/run-plugin')
const DonePlugin = require('./plugins/done-plugin')

module.exports = {
    mode:'development',
    entry:"./src/index.js",
    plugins: [
        new RunPlugin(),
        new DonePlugin(),
    ]
}