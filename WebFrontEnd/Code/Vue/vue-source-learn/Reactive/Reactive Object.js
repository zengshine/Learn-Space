const sharedPropertyDefinition={
    enumerable:true,
    configurable:true,
    get:noop,
    set:noop
}
export function proxy(target,sourceKey,key){
    sharedPropertyDefinition.get=function(){
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set=function(val){
        this[sourceKey][key]=val
    }
    Object.defineProperty(target,key,sharedPropertyDefinition)
}

export function observe(value){
    let ob=new Observer(value)
    return ob
}

export class Observer{
    constructor(value){
        this.dep=new Dep()
        this.value=value
        Object.defineProperty(value,'_ob_',{value:this})
        if(Array.isArray(value)){
            observeArray(value)
        }else{
            walk(value)
        }
    }
    walk(value){
        const keys=Object.keys(value)
        for(let i=0;i<keys.length;i++){
            defineReactive(value,value[key])
        }
    }
    observeArray(value){
        for(let i=0;i<value.length;i++){
            observe(value[i])
        }
    }
}

export function defineReactive(obj,key,val){
    const dep=new Dep()
    const property=Object.getOwnPropertyDescriptor(obj,key)
    if(property&&property.configurable===false){
        return
    }

    //cater for pre-define getters/setters
    const getter=property&&property.get
    const setter=property&&property.set
    if ((!getter || setter) && arguments.length === 2) {
        val = obj[key]
    }

    //深层定义子属性的响应性
    let chilObj=!shallow&&observe(val)

    Object.defineProperty(obj,key,{
        enumerable:true,
        configurable:true,
        get:function(){
            const value=getter?getter.call(obj):val
            if(Dep.target){
                dep.depend()
                if(chilObj){
                    chilObj.dep.depend()
                }
                //如果值是数组的话，对数组类型的值作特殊处理
                if(Array.isArray(value)){
                    dependArray(value)
                }
            }
            return value           
        },
        set:function(newVal){
            const value=getter?getter.call(obj):val
            if(value===newVal||(newVal!==newVal&&value!==value)){
                return
            }
            if(setter){
                setter.call(obj,newVal)
            }else{
                val=newVal
            }
            childOb=!shadow&&observe(newVal)
            dep.notify()
        }
    })
}