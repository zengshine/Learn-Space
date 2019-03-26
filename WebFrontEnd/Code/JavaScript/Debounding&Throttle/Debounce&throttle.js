function limit(fn,wait,isImmediate,isDebounce){
    let timer=null,context=null,args=[]
    let later=function(context,args){
        return setTimeout(function(){
            if(!isImmediate){
                fn.apply(context,args)
            }
            timer=null
        },wait)
    }
    return function limitFn(){
        let args=[].slice.call(arguments)
        let context=this
        if(!timer){
            timer=later(context,args)
            if(isImmediate){
                fn.apply(context,args)
            }
        }else{
            if(isDebounce){
                clearTimeout(timer)
                timer=later(context,args)
            }
        }
    }
}