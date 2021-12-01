/**
 * 功能：
 * 作者：zhoujingchun
 * 日期：
 */

class Compiler {
    constructor(options) {
        this.options = options
    }

    run() {
        // 5:根据配置的entry 找到入口文件

        let entry = {}
        if (typeof this.options.entry === "string") {
            entry.main = this.options.entry
        } else {
            entry = this.options.entry
        }

    }
}

module.exports = Compiler