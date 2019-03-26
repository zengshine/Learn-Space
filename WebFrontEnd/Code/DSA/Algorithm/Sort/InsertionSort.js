function InsertionSort(arr){
    let length=arr.length
    if(length<1) return
    for(i=1;i<arr.length;i++){
        let val=arr[i]
        let j=i-1
        for(;j>=0;j--){
            if(arr[j]>val){
                arr[j+1]=arr[j]
            }else{
                break;
            }
        }
        arr[j+1]=val
    }
}

var x=[9,8,5,3,1]

InsertionSort(x)
