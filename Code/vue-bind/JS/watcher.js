function Watcher(vm, exp, cb) {
    this.cb = cb
    this.vm = vm
    this.exp = exp
    this.value = this.get()
}

Watcher.prototype = {
    update() {
        this.run()
    },
    run() {
        let value = this.vm.data[this.exp]
        var oldVal = this.value
        if (value != oldVal) {
            this.value = value
            this.cb.call(this.vm, value, oldVal)
        }
    },
    get() {
        Observablee.target = this
        var value = this.vm.data[this.exp]
        Observablee.target = null
        return value
    }
}
