/**
 * 功能：
 * 作者：zhoujingchun
 * 日期：
 */
    // let { SyncHook } = require('tapable')

class SyncHook {
    constructor() {
        this.taps = []
    }

    tap(name, fn) {
        this.taps.push(fn)
    }

    call() {
        this.taps.forEach(tap => tap())
    }
}
