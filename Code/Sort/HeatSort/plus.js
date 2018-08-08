100
101

001
1000

1001
0

111
111

000
1110

function Sort(arr){
    if(arr.length==1){
       return arr
    }
       var mid=parseInt(arr.length>>1)
       var left=arr.slice(0,mid)
       var right=arr.slice(mid,arr.length)      
       return merge(Sort(left),Sort(right))
  }
  function merge(left,right){
    var help=[],leftIndex=0,rightIndex=0
    while(leftIndex<left.length&&rightIndex<right.length) {
        if(left[leftIndex]<right[rightIndex]){
            help.push(left[leftIndex++])
        }else{
            help.push(right[rightIndex++])
        }
    }
    while(leftIndex<left.length){
        help.push(left[leftIndex++])
    }
    while(rightIndex<right.length){
        help.push(right[rightIndex++])
    }
    return help
  }