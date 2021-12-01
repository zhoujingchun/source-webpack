/**
 * 功能：
 * 作者：zhoujingchun
 * 日期：
 */

const  {SyncHook} =require('tapable')
class Compiler {
    constructor(options) {
        this.options = options
        this.hooks= {
            run:new SyncHook(), //开启编译
            emit:new SyncHook(), //写入文件系统
            done: new SyncHook(), //编译工作全部完成


        }
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