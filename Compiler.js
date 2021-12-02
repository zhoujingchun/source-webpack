/**
 * 功能：
 * 作者：zhoujingchun
 * 日期：
 */

const {SyncHook} = require('tapable')
const {toUnixPath} = require("./utils.js")
const fs = require("fs")
const path = require("path")

const types = require('bable-types')  // 判断某个结点是否是某种类型，生成某个新的结点
const parser = require("@babel/parser")  //把源码生成AST语法树
const traverse = require("@babel/traverse").default    // 遍历器，用来遍历语法树
const generator = require("@babel/generator").default  // 生成器，根据语法树重新生成代码
let rootPath = this.options.context || process.cwd()

class Compiler {
    constructor(options) {
        this.options = options
        this.hooks = {
            run: new SyncHook(), //开启编译
            emit: new SyncHook(), //写入文件系统
            done: new SyncHook(), //编译工作全部完成
        }
        this.entries = new Set() //所有的入口模块
        this.modules = new Set() //所有的模块
        this.chunks = new Set() //所有的代码块
        this.assets = {}        //存放着本次要产出的文件
        this.files = new Set()  // 存放着本次编译所有产出的文件名
    }

    run() {
        this.hooks.run.call()
        // 5:根据配置的entry 找到入口文件


        let entry = {}
        if (typeof this.options.entry === "string") {
            entry.main = this.options.entry
        } else {
            entry = this.options.entry
        }


        // 6： 从入口文件出发，调用所有配置爹Loader对模块进行编译
        for (let entryName in entry) {
            let entryPath = toUnixPath(path.join(rootPath, entry[entryName]))
            let entryModule = this.buildModule(entryName, entryPath)
        }

    }

    buildModule(entryName, modulePath) {
        // 1:读取此模块的内容
        const originSourceCode = fs.readFileSync(modulePath, "utf8")
        let targetSourceCode = originSourceCode
        // 2:调用所有的配置对模块进行编译
        const rules = this.options.module.rules

        // 得到了本文件模块生效的loader有哪些
        let loaders = []

        for (let i = 0; i < rules.length; i++) {
            if (modulePath.match(rules[i].test)) {
                loaders = [...loaders, ...rules[i].use]
            }

        }

        for (let i = loaders.length - 1; i >= 0; i--) {
            targetSourceCode = require(loaders[i])(targetSourceCode)
        }

        // 在找出该模块依赖的模块，在递归本步骤，直到所有入口依赖的文件都经历过了本步骤的处理
        // A-B-C 模块ID都是相对于根目录的相对路径
        let moduleId = './' + path.posix.relative(rootPath, modulePath)

        let module = {id: moduleId, dependencies: [], name: entryName}
        console.log(targetSourceCode, "targetSourceCode")

    }
}

module.exports = Compiler