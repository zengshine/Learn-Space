const PENDING='pending'
const RESOLVED='resolved'
const REJECT='reject'

//promise accepts a funciton argument that will execute immediately
function MyPromise(fn){
    let _this=this
    _this.currentState=PENDING
    _this.value=undefined
    // To save the callback of 'then', only cached when the state of promise is pending
    // at most one will be cached in every instance
    _this.resolvedCallbacks=[]
    _this.rejectedCallbacks=[]

    _this.resolve=function(value){
        //execute asynchronously to guarantee the execution order
        setTimeout(()=>{
            if(value instanceof MyPromise){
                // if value is a Promise, execute recursively
                return value.then(_this.resolve,_this.REJECT)
            }

            if(_this.currentState===PENDING){
                _this.currentState=RESOLVED
                _this.value=value
                _this.resolvedCallbacks.forEach(cb => {
                    cb()
                });
            }
        })
    }
    _this.reject = function(reason) {
        // execute asynchronously to guarantee the execution order
        setTimeout(() => {
          if (_this.currentState === PENDING) {
            _this.currentState = REJECTED;
            _this.value = reason;
            _this.rejectedCallbacks.forEach(cb => cb());
          }
        })
      }
    
      // to solve the following problem
      // `new Promise(() => throw Error('error))`
      try {
        fn(_this.resolve, _this.reject);
      } catch (e) {
        _this.reject(e);
      }
}

//then method
MyPromise.prototype.then=function(onResolved,onRejected){
    const self=this
    // specification 2.2.7, 'then' must return a new promise
    let promise2
    // specification 2.2, both 'onResolve' and 'onRejected' are optional arguments
    // it should be ignored if 'onResolve' or 'onReject' is not a function,
    //which implements the penetrate pass of it's value
    //'Promise.resolve(4).then().then(value=>console.log(value))'
    onResolve=typeof onResolved==='function'?onResolved:v=>v
    onRejected=typeof onRejected==='function'?onRejected:r=>{throw r}

    if(self.currentState===resolve){
        return (promise2=new MyPromise((resolve,reject)=>{
            //wrap them with setTimeout,in order to insure that 'onFulfilled' and 'onReject' execute asynchronously
            setTimeout(()=>{
                try{
                    let x=onResolved(self.value)
                    resolutionProcedure(promise2,x,resolve,reject)
                }catch(ex){
                    reject(ex)
                }
            })
        }))
    }

    if (self.currentState === REJECTED) {
        return (promise2 = new MyPromise((resolve, reject) => {
          // execute `onRejected` asynchronously
          setTimeout(() => {
            try {
              let x = onRejected(self.value);
              resolutionProcedure(promise2, x, resolve, reject);
            } catch (reason) {
              reject(reason);
            }
          });
        }))
      }

    if (self.currentState === PENDING) {
        return (promise2 = new MyPromise((resolve, reject) => {
          self.resolvedCallbacks.push(() => {
             // Considering that it may throw error, wrap them with `try/catch`
            try {
              let x = onResolved(self.value);
              resolutionProcedure(promise2, x, resolve, reject);
            } catch (r) {
              reject(r);
            }
          });
    
          self.rejectedCallbacks.push(() => {
            try {
              let x = onRejected(self.value);
              resolutionProcedure(promise2, x, resolve, reject);
            } catch (r) {
              reject(r);
            }
          })
        }))
      }
}

//specification 2.3
function resolutionProcedure(promise2,x,resolve,reject){
    // specification 2.3.1, 'x' and 'promise2' can't refer to the same object,
    //avoiding the circular references
    if(promise2===x){
        return reject(new TypeError('argument[0] and argument[1] can\'t refer to the same object'));      
    }
    //if 'x' is a Promise and the state is 'pending',the promise must remain
    //If not ,it should execute
    if(x instanceof MyPromise){
        if(x.currentState===PENDING){
            x.then(value=>{
                resolutionProcedure(promise2,value,resolve,reject)
            })
        }else{
            x.then(resolve,reject)
        }
        return;
    }
    // specification 2.3.3.3.3
    // if both `reject` and `resolve` are executed, the first successful
    // execution takes precedence, and any further executions are ignored
    let called=false
    // specification 2.3.3, determine whether 'x' is an object or a funciton
    if(x!==null&&(typeof x==='object'||typeof x==='function')){
        // specification 2.3.3, if then is a function call then
        try{
            let then=x.then
            if(typeof then==='function'){
                then.call(x,y=>{
                    if(called) return
                    called=true
                    //specification 2.3.3.3.1
                    resolutionProcedure(promise2,y,resolve,reject)
                },e=>{
                    if(called) return
                    called=true
                    reject(e)
                })
            }else{
                resolve(x)
            }
        }catch(ex){
            if(called) return
            called=true
            reject(ex)
        }
    }else{
        resolve(x)
    }
}
