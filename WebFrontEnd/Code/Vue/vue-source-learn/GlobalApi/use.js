Vue.use=function(plugin){
    const _installedPlugins=this._installedPlugins||(this._installedPlugins=[])
    if(_installedPlugins.indexOf(plugin)>-1){
        return this
    }
    const args=[].slice.call(arguments,1)
    args.unshift(this)
    if(typeof plugin.install==='function'){
        plugin.install.apply(plugin,args)
    }else if(typeof plugin==='function'){
        plugin.apply(null,args)
    }
    _installedPlugins.push(this)
    return this
}
var arr=[1,5,8,7,9,44];
var val=5
function deleteItem(arr,val){
    for(i=0;i<arr.length;i++){
        if(arr[i]>val){
            arr.splice(i,1)
            console.log(arr[i])
            i--
        }
    }
}
