
Vue.prototype.$on=function(event, fn){
    var vm=this
    if(Array.isArray(event)){
        for (let i = 0, l = event.length; i < l; i++) {
            this.$on(event[i], fn)
          }
    }
    (vm._events[event]||(vm._events[event]=[])).push(fn)
    return vm
}

Vue.prototype.$once=function(event, fn){
    var vm=this
    //先移除事件处理函数，再执行真正的事件处理函数，保证该事件处理函数只会触发一次
    function on(){
        vm.$off(event,on)
        fn.apply(vm,arguments)
    }
    vm.$on(event,on)
}

Vue.prototype.$off=function(event,fn){
    var vm=this
    //当参数为空，移除所有事件
    if(!arguments.length){
        vm._events=Object.create(null)
    }
    if(Array.isArray(event)){
        for (let i = 0, l = event.length; i < l; i++) {
            this.$on(event[i], fn)
          }
    }
    if(!fn){
        vm._events[event]=null
    }
    if(fn){
        let cbs=vm._events[event]
        let i=cbs.length
        while(i--){
            if(vm._events[event][i]===fn){
                vm._events[event].splice(i,1)
                break
            }
        }
    }
    return vm
}

Vue.prototype.$emit=function(event){
    let vm=this
    let args=[].slice.call(arguments,1)
    let cbs=vm._events[event]
    for(let i=0;i<cbs.length;i++){
        cbs[i].apply(vm,args)
    }
    return vm
}