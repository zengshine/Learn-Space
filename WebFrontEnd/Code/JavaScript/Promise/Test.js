
// three states
const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';
// promise accepts a function argument that will execute immediately.
function MyPromise(fn) {
  let _this = this;
  _this.currentState = PENDING;
  _this.value = undefined;
  // To save the callback of `then`，only cached when the state of the promise is pending,
  //  at most one will be cached in every instance
  _this.resolvedCallbacks = [];
  _this.rejectedCallbacks = [];

  _this.resolve = function(value) {
    // execute asynchronously to guarantee the execution order
    setTimeout(() => {
      if (value instanceof MyPromise) {
        // if value is a Promise, execute recursively
        return value.then(_this.resolve, _this.reject)
      }
      if (_this.currentState === PENDING) {
        _this.currentState = RESOLVED;
        _this.value = value;
        _this.resolvedCallbacks.forEach(cb => cb());
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

MyPromise.prototype.then = function(onResolved, onRejected) {
  const self = this;
  // specification 2.2.7， `then` must return a new promise
  let promise2;
  // specification 2.2, both `onResolved` and `onRejected` are optional arguments
  // it should be ignored if `onResolved` or `onRjected` is not a function,
  // which implements the penetrate pass of it's value
  // `Promise.resolve(4).then().then((value) => console.log(value))`
  onResolved = typeof onResolved === 'function' ? onResolved : v => v;
  onRejected = typeof onRejected === 'function' ? onRejected : r => {throw r};

  if (self.currentState === RESOLVED) {
    return (promise2 = new MyPromise((resolve, reject) => {
      // specification 2.2.4, wrap them with `setTimeout`,
      // in order to insure that `onFulfilled` and `onRjected` execute asynchronously
      setTimeout(() => {
        try {
          let x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
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

// specification 2.3
function resolutionProcedure(promise2, x, resolve, reject) {
  // specification 2.3.1，`x` and  `promise2` can't refer to the same object,
  // avoiding the circular references
  if (promise2 === x) {
    return reject(new TypeError('Error'));
  }

  // specification 2.3.2, if `x` is a Promise and the state is `pending`,
  // the promise must remain, If not, it should execute.
  if (x instanceof MyPromise) {
    if (x.currentState === PENDING) {
      // call the function `resolutionProcedure` again to
      // confirm the type of the argument that x resolves
      // If it's a primitive type, it will be resolved again to
      // pass the value to next `then`.
      x.then((value) => {
        resolutionProcedure(promise2, value, resolve, reject);
      }, reject)
    } else {
      x.then(resolve, reject);
    }
    return;
  }

  // specification 2.3.3.3.3
  // if both `reject` and `resolve` are executed, the first successful
  // execution takes precedence, and any further executions are ignored
  let called = false;
  // specification 2.3.3, determine whether `x` is an object or a function
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // specification 2.3.3.2, if can't get `then`, execute the `reject`
    try {
      // specification 2.3.3.1
      let then = x.then;
      // if `then` is a function, call the `x.then`
      if (typeof then === 'function') {
        // specification 2.3.3.3
        then.call(x, y => {
          if (called) return;
          called = true;
          // specification 2.3.3.3.1
          resolutionProcedure(promise2, y, resolve, reject);
        }, e => {
          if (called) return;
          called = true;
          reject(e);
        });
      } else {
        // specification 2.3.3.4
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // specification 2.3.4, `x` belongs to primitive data type
    resolve(x);
  }
}

var thanable = {
    then: function (suc) {
        suc("thanable")
    }
}

var retPromise = new MyPromise(resolve => {
    setTimeout(() => {
        resolve(thanable)
    }, 2000)  //2s后 resolve(thanable)
})

setTimeout(() => {
    new MyPromise(resolve => {
        resolve()
    }).then(() => {
        return retPromise  //retPromise:pending
    }).then((data) => {
        console.log(data)
    })
}, 1000)

setTimeout(() => {
    new MyPromise(resolve => {
        resolve()
    }).then(() => {
        return retPromise //retPromise:resolve
    }).then((data) => {
        console.log(data)
    })
}, 3000)

var thanable = {
    then: function (suc) {
        suc("thanable")
    }
}

var retPromise = new Promise(resolve => {
    setTimeout(() => {
        resolve(thanable)
    }, 2000)  //2s后 resolve(thanable)
})

setTimeout(() => {
    new Promise(resolve => {
        resolve()
    }).then(() => {
        return retPromise  //retPromise:pending
    }).then((data) => {
        console.log(data)
    })
}, 1000)

setTimeout(() => {
    new Promise(resolve => {
        resolve()
    }).then(() => {
        return retPromise //retPromise:resolve
    }).then((data) => {
        console.log(data)
    })
}, 3000)