function deepCloneByLoop(obj){
    if(!obj&&typeof obj!=='object'){
        return obj
    }
    let res=new obj.constructor()
    let walkStack=[{src:obj,tar:res}]
    while(walkStack.length>0){
        var cur=walkStack.pop()
        let curSrc=cur.src
        let curTar=cur.tar
        for(key in curSrc){
            if(curSrc.hasOwnProperty(key)){
                if(curSrc[key].constructor===Object||curSrc[key].constructor===Array){
                    curTar[key]=new curSrc[key].constructor()
                    walkStack.push({src:curSrc[key],tar:curTar[key]})
                }else{
                    curTar[key]=curSrc[key]
                }
            }
        }
    }
    return res
}