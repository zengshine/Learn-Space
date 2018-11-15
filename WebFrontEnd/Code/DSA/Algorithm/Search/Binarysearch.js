function bSearch(arr,val){
    let len=arr.length
    let high=len
    let low=0
    let mid
    while(low<=high){
        mid=((high+low)/2)^0
        if(val<arr[mid]){
            high=mid-1
        }else if(val>mid){
            low=mid+1
        }else{
            return mid
        }
    }
    return -1
}

function bSearchByReverse(arr,low,high,val){
    if(low>high){
        return -1
    }
    let mid=low+(high-low)>>1
    if(arr[mid]>val){
        high=mid-1
       return bSearchByReverse(arr,low,high,val)
    }else if(arr[mid]<val){
        low=mid+1
       return bSearchByReverse(arr,low,high,val)
    }else{
        return mid
    }   
}

class CompositeIterator{
    CompositeIterator(iterator){
        this.stack=[iterator]
    }
    next(){
        if(this.hasNext()){
            let iterator=this.stack[this.stack.length-1]
            let component=iterator.next()
            if(component instanceof Menu){
                this.stack.push(component)
            }
            return component
        }else{
            return null
        }
    }
    hasNext(){
        if(this.stack.length===0){
            return false
        }else{
            let iterator=this.stack[this.stack.length-1]
            if(iterator.hasNext()){
                return true
            }else{
                this.stack.pop()
                return this.hasNext()
            }
        }
    }
}

function once(fn){
    let called=false
    return function(){
        if(!called){
            called=true
            fn.apply(vm,arguments)
        }
    }
}