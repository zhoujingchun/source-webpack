/**
 * 功能：
 * 作者：zhoujingchun
 * 日期：
 */

let Compiler = require('./Compiler')

function webpack(options) {
    const shellOptions = process.argv.slice(2).reduce((config, args) => {
        let [key, value] = args.split("=") // --mode=production
        config[key.slice(2)] = value
        return config
    }, {})

    let finalOptions = {...options, ...shellOptions}

    let compiler = new Compiler(finalOptions)
    // 加载所有配置的插件

    if (finalOptions.plugins && Array.isArray(finalOptions.plugins)) {
        for (let plugin of options.plugins) {
            plugin.apply(compiler)

        }
    }


    return compiler

}

module.exports = webpack