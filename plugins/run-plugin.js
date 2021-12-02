/**
 * 功能：
 * 作者：zhoujingchun
 * 日期：
 */
class RunPlugin {
    apply (compiler){
        // 挂载阶段
        //注册done这个钩子
         //console.log(compiler.hooks.done)
        compiler.hooks.run.tap('DonePlugin',()=>{
             // 执行阶段
            console.log(("挂载RunPlugin"))
        })

    }
}

module.exports  = RunPlugin


//