//Naming Convention:property name prefixed with underscore
class Shape{
    constructor(width,height){
      this._width=width
      this._height=height
    }
    get area(){
        return this._width*this._height
    }
}

//WeakMap
const _map=new WeakMap()

const internal=obj=>{
    if(!_map.has(obj)){
        _map.set(obj,{})
    }else{
        _map.set(obj,{})       
    }
    return _map.get(obj)      
}
class Shape{
    constructor(width,height){
      
      internal(this)._width=width
      internal(this)._height=height
    }
    get area(){
        return internal(this)._width*internal(this)._height
    }
}

//symbol
const widthSymbol=new Symbol('width')
const heightSymbol=new Symbol('height')

class shape{
    constructor(width,height){
      this[widthSymbol]=width
      this[heightSymbol]=height
    }
    get area(){
        return this[widthSymbol]*this[heightSymbol]
    }
}

//closure
function Shape(){
    const _this={}
    class Shape{
        constructor(width,height){
            _this.width=width
            _this.height=height
        }
        get area(){
            return _this.width*_this.height
        }
    }
    var instance=new Shape(...arguments)
    return Object.setPrototypeOf(Object.getPrototypeOf(instance),this)
}

//proxy
class Shape{
    constructor(width,height){
        this._width=width
        this._height=height
      }
      get area(){
          return this._width*this._height
      }
}

const handler={
    get(target,key){
        if(key[0]==='_'){
            throw new Error('Attemp to access private property')
        }
        //override the toJSON function to only return the "public" properties
        if(key==='toJSON'){
            const obj={}
            for(const key in target){
                if(key[0!=='_']){
                    obj[key]=target[key]
                }
            }
            return ()=>obj
        }
        return target[key]
    },
    set(target,key,value){
        if(key[0]==='_'){
            throw new Error('Attemp to access private property')
        }
        target[key]=value
    },
    getOwnPropertyDescriptor(target,key){
        var des=target.getOwnPropertyDescriptor(key)
        if(key[0]==='_'){
            des.enumerable=false
        }
        return des
    }
}
