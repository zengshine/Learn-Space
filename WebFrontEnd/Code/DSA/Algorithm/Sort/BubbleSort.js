function BubbleSort(arr){
    let length=arr.length
    let swapFlag=false
    for(i=length;i>0;i--){
        for(j=0;j<i-1;j++){
            if(arr[j]<arr[j+1]){
                let temp=arr[j]
                arr[j]=arr[j+1]
                a[j+1]=temp
                swapFlag=true
            }
        }
        if(swapFlag==false){
            break
        }
    }
}