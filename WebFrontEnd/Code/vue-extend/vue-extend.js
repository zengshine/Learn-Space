/**
 * Class inheritance
 */
Vue.extend=function(extendOptions){
    extendOptions=extendOptions||{}
    const Super=this 
    const SuperId=Super.cid
    const cachedCtors=extendOptions._Ctor||(extendOptions._Ctor={})
    if(cachedCtors[SuperId]){
        return cachedCtors[SuperId]
    }
    const Sub=function VueComponent(options){
        this._init(options) //调用父构造函数的_init函数
    }
    Sub.prototype=Object.create(Super.prototype)
    Sub.prototype.constructor=Sub
    Sub.options=mergeOptions(Super.options,extendOptions)
    Sub['super']=Super

    // allow further extension/mixin/plugin usage
    Sub.extend=Super.extend
    Sub.mixin=Super.mixin
    Sub.use=Super.use
    cachedCtors[SuperId]=Sub
    return sub
}