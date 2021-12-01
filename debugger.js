/**
 * 功能：
 * 作者：zhoujingchun
 * 日期：
 */

let webpack = require("webpack")
// 1.初始化参数 从配置文件中读取配置对象，然后和shell参数进行合并 得到最终的合并对象
const  options = require ("./webpack.config")

// 2：用上一个得到的参数对象初始化Compiler对象

// 3. 加载所有的配置插件
let compiler = webpack(options)

//4:调用Compiler的run方法
/*
compiler.run((err,stats)=>{
    debugger
    console.log(err)
    console.log(stats.toJson({
        entries:true, //入口信息
        modules:true, //本次打包有哪些模块
        chunks:true,  //代码块
        assets:true,  // 产出的资源
        files:true,  //最后生成额哪些文件
    }))
})*/
