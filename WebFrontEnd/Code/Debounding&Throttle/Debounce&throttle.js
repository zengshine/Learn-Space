function limit(fn,wait,isImmediate,isDebounce){
    let timer=null
    let later=function(){
        return setTimeout(function(){
            timer=null
            if(!isImmediate){
                fn.apply(context,args)
            }
        },wait)
    }
    return function limitFn(){
        let args=[].slice.call(arguments)
        let context=this
        if(!timer){
            timer=later()
            if(isImmediate){
                fn.apply(context,args)
            }
        }else{
            if(isDebounce){
                clearTimeout(timer)
                timer=later()
            }
        }
    }
}