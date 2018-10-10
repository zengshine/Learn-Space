// define status const variable
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function MyPromise(handler) {
    if (typeof handler !== 'function') {
        return new Error('MyPromise must accept a function as a parameter')
    }
    //state:pending,fullfilled,rejected
    this._status = PENDING
    //value
    this._value = null
    //fulfilled callback queue
    this._fullfilledQueues = []
    //rejected callback queue
    this._rejectedQueues = []
    //resolve function
    this.runFulfilledCb = function (val) {
        //更改当前Promise对象状态
        this._status = FULFILLED
        this._value = val
        let cb
        //执行Promise对象的回调函数
        while (cb = this._fullfilledQueues.shift()) {
            cb(this._value)
        }
    }
    this.runRejectedCb = function (val) {
        //更改当前Promise对象状态
        this._status = REJECTED
        this._value = val
        let cb
        //执行Promise对象的回调函数
        while (cb = this._rejectedQueues.shift()) {
            cb(this._value)
        }
    }
    this._resolve = function (val) {
        if (this._status !== PENDING) {
            return
        }

        function run() {
            if (val instanceof MyPromise) {
                val.then(val => {
                    this.runFulfilledCb(val)
                }, err => {
                    this.runFulfilledCb(val)
                })
            } else {
                this.runFulfilledCb(val)
            }
        }
        //then中的回调函数是异步调用
        setTimeout(() => run(), 0)
    }
    //reject function
    this._reject = function (err) {
        if (this._status !== PENDING) {
            return
        }

        function run() {
            if (val instanceof MyPromise) {
                val.then(val => {
                    this.runRejectedCb(val)
                }, err => {
                    this.runRejectedCb(val)
                })
            } else {
                this.runRejectedCb(val)
            }
            //then中的回调函数是异步调用
            setTimeout(() => run(), 0)
        }
    }
    //execute handler
    try {
        handler(this._resolve.bind(this), this._reject.bind(this)))
} catch (err) {
    this._reject(err)
}
}
MyPromise.prototype.then = function (onFullfilled, onRejected) {
    const {
        _status,
        _value
    } = this
    //返回一个新的Promise对象
    return new MyPromise((resolveNext, rejectNext) => {
        //封装成功时执行的函数
        let fullfilled = value => {
            try {
                //如何回调参数不是函数，将此参数值作为返回Promise对象的内部值
                if (typeof onFullfilled !== 'function') {
                    resolveNext(onFullfilled)
                } else {
                    let res = onFullfilled(value)
                    //如果回调函数返回值是Promise对象，则将此Promise对象的状态与要返回的Promise状态同步，
                    //在成功回调中执行要返回Promise对象的resove,在失败回调中执行要返回Promise对象的reject
                    if (res instanceof MyPromise) {
                        res.then(resolveNext, rejectNext)
                    } else {
                        resolveNext(res)
                    }
                }
            } catch (err) {
                //如果函数执行出错，新的Promise对象的状态转为失败
                rejectNext(err)
            }
        }
        //定义错误回调执行函数
        let rejected = error => {
            try {
                if (typeof onRejected !== 'function') {
                    rejectNext(onRejected)
                } else {
                    let res = onRejected(error)
                    if (res instanceof MyPromise) {
                        res.then(resolveNext, rejectNext)
                    } else {
                        rejectNext(res)
                    }
                }
            } catch (err) {
                rejectNext(err)
            }
        }
        switch (_status) {
            case PENDING:
                onFullfilled ? this._fullfilledQueues.push(onFullfilled) : void(0)
                onRejected ? this._rejectedQueues.push(onRejected) : void(0)
                break
            case FULFILLED
            fullfilled(_value)
            break
            case REJECTED
            rejected(_value)
            break
        }
    })
}
//catch
MyPromise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected)
}
//静态resolve方法
MyPromise.resolve = function (val) {
    //如果参数是MyPromise实例，直接返回该实例
    if (val instanceof MyPromise) {
        return val
    }
    return new MyPromise((resolve) => {
        resolve(val)
    })
}
//静态reject方法
MyPromise.reject = function (err) {
    return new MyPromise((resolve, reject) => {
        reject(val)
    })
}
//静态all方法
MyPromise.all = function (myPromiseList) {
    return new MyPromise((resolve, reject) => {
        let values = []
        let count = 0
        for (let (i, p) of myPromiseList.entries) {
            //如果该项不是MyPromise实例，则调用MyPromise.resolve()方法返回一个MyPromise实例
            this.resolve(p).then(res => {
                values.push(res)
                count++
                //如果数组中所有MyPromise对象状态都变为fulFulled时，则resolve所有值
                if (count === myPromiseList.length) {
                    resolve(values)
                }
            }, err {
                //只要有一个MyPromise实例状态变为rejected,则reject返回值       
                reject(err)
                //break?               
            })
        }
    })
}
//静态race方法
MyPromise.race = function (myPromiseList) {
    return new MyPromise((resolve, reject) => {
        for (let (i, p) of myPromiseList.entries) {
            //如果该项不是MyPromise实例，则调用MyPromise.resolve()方法返回一个MyPromise实例
            this.resolve(p).then(res => {
                //如果数组中所有MyPromise对象状态都变为fulFulled时，则resolve所有值
                resolve(values)
                //break?
            }, err {
                //只要有一个MyPromise实例状态变为rejected,则reject返回值       
                reject(err)
                //break?               
            })
        }
    })
}

//finally方法，finally方法总是会返回原来的值。
MyPromise.prototype.finally = function (cb) {
    return this.then(res => {
        return MyPromise.resolve(cb()).then(() => value)
    }, err => {
        return MyPromise.resolve(cb()).then(() => {
            throw err
        })
    })
}

[1, "string", true, null, undefined, [], {}].forEach(element => {
    console.log(`${element}:${typeof(element)}`)
})

function closou() {
    var a = 1
    setTimeout(function () {
        console.log(a)
        a = 3
    }, 1000)
    a = 2
    setTimeout(function () {
        console.log(a)
        a = 4
    }, 3000)
}
closou()
console.log(0)