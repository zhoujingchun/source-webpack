/**
 * 功能：
 * 作者：zhoujingchun
 * 日期：
 */
class DonePlugin {
    apply (compiler){
        console.log(("挂载donePlugin"))
    }
}

module.exports  = DonePlugin