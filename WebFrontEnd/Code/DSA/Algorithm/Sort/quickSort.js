function quickSort(arr,min,max){
    if(min>=max){
        return
    }
    let p=partition(arr,max)
    quickSort(arr,min,p-1)
    quickSort(arr,p+1,max)
}
function partition(arr,max){
    let i=0;
    for(j=0;j<max;j++){
        if(arr[j]<=arr[max]){
            let temp=arr[i]
            arr[i]=arr[j]
            arr[j]=temp
            i++
        }
    }
    let temp=arr[i]
    arr[i]=arr[max]
    arr[max]=temp
    return i
}