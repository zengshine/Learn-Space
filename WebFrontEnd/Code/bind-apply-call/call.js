Function.prototype.myCall=function(){
    if(typeof this !=='function'){
        return new TypeError('myCall should be called by a function')
    }
    var context=arguments[0]||window
    var args=[]
    for(var i=1;i<arguments.length;i++){
        args.push("arguments["+i+"]")
    }
    var uniqueId=Math.random().toString()
    while(context.hasOwnProperty(uniqueId)){
        uniqueId=Math.random().toString()
    }
    context[uniqueId]=this
    //strings are reparsed into statement in the eval method
    //args will automatically calls the Array.toString() method
    var result=eval("context[uniqueId]("+args+")")
    delete context.fn
    return result
}