/**
 * 功能：
 * 作者：zhoujingchun
 * 日期：
 */


// 统一路径分割符合  把\换成/
function toUnixPath(filePath) {
    return filePath.replace(/\\/g,"/")
}

exports.toUnixPath = toUnixPath