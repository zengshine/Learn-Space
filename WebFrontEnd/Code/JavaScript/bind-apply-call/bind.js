Function.prototype.bind=function(){
    if(typeof this!=='funciton'){
        return new TypeError('This method should be called by a function')
    }
    var _this=this
    var context=arguments[0]
    var args=[].slice.call(this.arguments,1)
    return function bindF(){
        //return _this.apply(this instanceof _this?_this:context,[...args,...arguments])
        if(this instanceof bindF){
            return new _this(...args,...arguments)
        }
        return _this.apply(context,[...args,...arguments])
    }
}
