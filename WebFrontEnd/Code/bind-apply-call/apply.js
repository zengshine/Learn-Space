Function.prototype.myApply=function(){
    if(typeof this !=='function'){
        return new TypeError('myCall should be called by a function')
    }
    var result=null
    var context=arguments[0]
    var args=[]
    var argArr=arguments[1]
    var uniqueId=Math.random().toString()
    while(context.hasOwnProperty(uniqueId)){
        uniqueId=Math.random().toString()
    }
    context[uniqueId]=this
    if(!argArr){
        return context[uniqueId]()
    }
    for(var i=1;i<argArr.length;i++){
        args.push("argArr["+i+"]")
    }
    //strings are reparsed into statement in the eval method
    //args will automatically calls the Array.toString() method
    result=eval("context.uniqueId("+args+")")
    delete context[uniqueId]
    return result
}