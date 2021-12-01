/**
 * 功能：
 * 作者：zhoujingchun
 * 日期：
 */
class RunPlugin {
    apply (compiler){
        console.log(("挂载RunPlugin"))
    }
}

module.exports  = RunPlugin