function mergeSort(arr,min,max){
    if(min>=max){
        //递归终止条件
        return
    }
    mergeSort(arr,min,(min+max)/2)
    mergeSort(arr,(min+max)/2+1,max)
    merge(arr,min,max)
}
function merge(arr,min,max){
    let temp=[]
    let mid=(min+max)/2
    let i=min
    let j=mid+1
    let k=0
    let start=0
    let end=0
    while(i<=mid&&j<=max){
        if(arr[i]<=arr[j]){
            temp[k]=arr[i]
            i++
        }else{
            temp[k]=arr[j]
            j++

        }
        k++
    }
    if(i<=mid){
        start=i
        end=mid
    }else{
        start=j
        end=max
    }
    while(start<=end){
        temp[k]=arr[start]
        start++
    }
    k=0
    while(k<=(max-min)){
        arr[min+k]=temp[k]
        k++
    }
}