/**
 * 功能：
 * 作者：zhoujingchun
 * 日期：
 */

// loader 其实就是一个函数，接受原始内容，返回转换后的内容
function loader(source) {
    console.log("logger2-loader2222")
    return source + "loager2"

}

module.exports = loader