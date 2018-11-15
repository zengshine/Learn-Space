quickSort(arr,min,max){
    if(min>=max){
        return
    }
    var p=(min+max)/2
    partition(arr,min,max,p)
    quickSort(arr,min,p-1)
    quickSort(arr,p+1,max)
}
partition(arr,min,max,p){
    let start=min
    let end=max
    while(start<=end){
        if((arr[start]>arr[p]&&start<p)||(arr[start]<arr[p]&&start>p])){
            let temp=arr[start]
            arr[start]=arr[p]
            arr[p]=temp
            p=start
        }
        start++
    }
}