/**
 * 功能：
 * 作者：zhoujingchun
 * 日期：
 */

const {SyncHook} = require('tapable')
const {toUnixPath} = require("./utils.js")
const fs = require("fs")
const path = require("path")

const types = require('babel-types')  // 判断某个结点是否是某种类型，生成某个新的结点
const parser = require("@babel/parser")  //把源码生成AST语法树
const traverse = require("@babel/traverse").default    // 遍历器，用来遍历语法树
const generator = require("@babel/generator").default  // 生成器，根据语法树重新生成代码
let rootPath =  toUnixPath(process.cwd())

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


         //{ entry1: './src/entry1.js', entry2: './src/entry2.js' } entry
        // 6： 从入口文件出发，调用所有配置的Loader对模块进行编译
        for (let entryName in entry) {
            let entryPath = toUnixPath(path.join(rootPath, entry[entryName]))  // /source-webpack/src/entry2.js

            let entryModule = this.buildModule(entryName, entryPath)
            this.entries.add(entryModule)
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
            console.log( require(loaders[i])(targetSourceCode),'12345')
            targetSourceCode = require(loaders[i])(targetSourceCode)
        }

        // 7.在找出该模块依赖的模块，在递归本步骤，直到所有入口依赖的文件都经历过了本步骤的处理
        // A-B-C 模块ID都是相对于根目录的相对路径

        let moduleId = './' + path.posix.relative(rootPath, modulePath)

        let module = {id: moduleId, dependencies: [], name: entryName}

        //在找该模块依赖的模块，把转换后的源码转出抽象语法树
        let ast = parser.parse(targetSourceCode, {sourceType: 'module'})
        console.log(rootPath,modulePath,moduleId,"modulePath")
        console.log(111,targetSourceCode,"targetSourceCode")
        traverse(ast, {
            CallExpression: ({ node }) => {
                if (node.callee.name === "require") {
                    // 要引入模块的相对路径
                    let moduleName = node.arguments[0].value //  let title = require("title")
                    // 为了获取要加载模块的绝对路径 第一步获取当前模块的所在目录
                    let dirName = path.posix.dirname(modulePath)
                    let depModulePath = path.posix.join(dirName, moduleName)
                    console.log(depModulePath, "depModulePath")
                    let extension = this.options.resolve.extensions
                    // 添加文件后缀
                    depModulePath = treExtensions(depModulePath,extension,moduleName,dirName)
                    let depModuleId = './'+path.posix.resolve(rootPath,depModulePath) //./src/title.js

                    node.arguments=[types.stringLiteral(depModuleId)]

                    //判断已经变异过的modules里有没有这个模块，如果没有则添加

                    // if(this.modules.has(depModuleId)){
                    //     module.dependencies.push(depModulePath)
                    // }

                    let alreadyModules = Array.from(this.modules).map(module=>module.id)
                    // 如果编译过的模块的里不包含这个依赖模块的话才添加，如果已经包含了，就不要添加了
                    if (alreadyModules.includes(depModuleId)){
                        module.dependencies.push(depModulePath)
                    }


                }
            }
        })
        let {code} = generator(ast)
        module._source = code //此模块的源代码

        // 把当前的模块变异完成，会找到它的所有依赖，进行递归编辑 添加到this.modules
        module.dependencies.forEach(dependency=>{
        let depModule = this.buildModule(entryName,dependency)
         this.modules.add(depModule)
        })
        return module
    }
}

/*
* modulePath:拼出来的路径 src/title
* extensions：[.js,.ts]
*
* */
function treExtensions(modulePath,extensions,originModulePath,moduleContext){
 extensions.unshift("")
   for (let i=0;i<extensions.length;i++){
       if (fs.existsSync(modulePath+extensions[i])){
           return modulePath+extensions[i]
       }
   }
   // 如果到了这句话还执行到了，表明没有一个后缀能匹配上
    throw new Error(`Module not found: Error:Can't resolve ${originModulePath}`)
}

module.exports = Compiler