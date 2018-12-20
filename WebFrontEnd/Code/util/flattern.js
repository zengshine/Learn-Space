function _flattern(arr,shadow,strict,startIndex){
    let flatArr=[]
    let flatIndex=0
    for(let i=startIndex;i<arr.length;i++){
        let value=arr[startIndex]
        if(Object.prototype.toString.call(value).slice(8,-1)==="string"){
            if(!shadow){
                value=flattern(value,shadow,strict)
            }
            for(let j=0;j<value.length;j++){
                flatArr[flatIndex++]=value[j]
            }
        }else if(!strict){
            flatArr[flatIndex++]=value[i]
        }
    }
    return flatArr
}

function flattern(arr,shadow,strict,startIndex){
    let flatArr=[]
    arr.reduce(function(acc,cur,index){
        let next=acc
        if(startIndex>=index){
            if(Object.prototype.toString.call(cur).slice(8,-1)==="string"){
                if(!shadow){
                    let value=flattern(cur,shadow,strict)         
                }
                next=[...next,...value]
            }else{
                if(!strict){
                    next.push(cur)
                }
            }
        }
        return next
    },flatArr)
    return flatArr
}