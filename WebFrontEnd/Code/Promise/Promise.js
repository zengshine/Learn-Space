const PENDING = "pending"
const RESOLVED = "resolved"
const REJECTED = "rejected"
class MyPromise {
    static resolvePromise(promise2,x,resolve,reject){
        // prevent thanable obj execute both resovle and reject function
        let thenCalledOrThrow=false
        if(promise2===x){
            throw("return promise can't be the same with result")
        }
        if(x instanceof MyPromise){
            if(x.state===PENDING){
                x.then(data=>{
                    MyPromise.resolvePromise(promise2,data,resolve,reject)
                },err=>{
                    reject(err)
                })
            }else{
                x.then(resolve,reject)
            }
        }
        if(x!==null&&(typeof x==='function'||typeof x==='object')){
            let thenFn=x.then
            if(typeof thenFn=='function'){
                try{
                    thenFn.apply(x,res=>{
                        if(thenCalledOrThrow)
                        return
                        MyPromise.resolvePromise(promise2,x,resolve,reject)
                        thenCalledOrThrow=true
                    },err=>{
                        if(thenCalledOrThrow)
                        return
                        reject(err)
                        thenCalledOrThrow=true
                    })
                }catch(err){
                    if(thenCalledOrThrow)
                    return
                    reject(err)
                    thenCalledOrThrow=true
                }
            }else{
                resolve(x)
            }
        }
    }
    constructor(executor) {
        let self = this
        this.state = PENDING
        this.value = {}
        this.resolvedCallbacks = []
        this.rejectedCallbacks = []

        function resolve(data) {
            if (data instanceof MyPromise) {
                data.then(resolve, reject)
                return
            }
            self.state = RESOLVED
            self.value = data
            self.rejectedCallbacks.forEach(cb => {
                cb(this.value)
            })
        }

        function reject(err) {
            self.state = REJECTED
            self.value = err
            self.rejectedCallbacks.forEach(cb => {
                cb(this.value)
            })
        }
        try {
            setTimeout(()=>{
                executor(resolve, reject)
            })
        } catch (err) {
            reject(err)
        }
    }
    then(resolvedCb, rejectedCb) {
        let self = this
        let retPromise;
        resolvedCb = typeof resolvedCb === 'function' ? resolvedCb : data => data;
        rejectedCb = typeof rejectedCb === 'function' ? resolvedCb : err => {
            throw (err)
        };
        setTimeout(()=>{
            return retPromise = new MyPromise((resolve, reject) => {
                let resolveFn=()=>{
                    try{
                        let res = resolvedCb(self.value)
                        MyPromise.resolvePromise(retPromise, res, resolve, reject)
                    }catch(err){
                        reject(err)
                    }
                }
                let rejectedFn=()=>{
                    try{
                        let res = rejectedCb(self.value)
                        MyPromise.resolvePromise(retPromise, res, resolve, reject)
                    }catch(err){
                        reject(err)
                    }
                }
                if (this.state == RESOLVED) {
                    resolveFn()
                }
                if (this.state == REJECTED) {
                    rejectedFn()
                }
                if (this.state == PENDING) {
                    this.resolvedCallbacks.push(resolveFn)
                    this.rejectedCallbacks.push(rejectedFn)
                }
            })
        })
    }
}