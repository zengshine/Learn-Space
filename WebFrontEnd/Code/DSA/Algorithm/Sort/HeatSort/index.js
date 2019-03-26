let arr = Array.of(1,4,75,16,7,32,56,20,17,9,2,5,8,3,10);
sort(arr);
console.log(arr)

function sort(arr) {
    //1.构建大顶堆
    for (let i =parseInt(arr.length / 2) - 1; i >= 0; i--) {
        //从第一个非叶子结点从下至上，从右至左调整结构
        adjustHeap(arr, i, arr.length);
    }
    //2.调整堆结构+交换堆顶元素与末尾元素
    for (let j = arr.length - 1; j > 0; j--) {
        swap(arr, 0, j);//将堆顶元素与末尾元素进行交换
        adjustHeap(arr, 0, j);//重新对堆进行调整
    }
}

/**
 * 调整大顶堆（仅是调整过程，建立在大顶堆已构建的基础上）
 * @param arr
 * @param i
 * @param length
 */
function adjustHeap(arr, i, length) {
    let temp = arr[i];//先取出当前元素i
    for (let k = i * 2 + 1; k < length; k = k * 2 + 1) {//从i结点的左子结点开始，也就是2i+1处开始
        if (k + 1 < length && arr[k] < arr[k + 1]) {//如果左子结点小于右子结点，k指向右子结点
            k++;
        }
        if (arr[k] > temp) {//如果子节点大于父节点，将子节点值赋给父节点（不用进行交换）
            arr[i] = arr[k];
            // arr[k]=temp
            i = k;
        } else {
            break;
        }
    }
    arr[i] = temp;//将temp值放到最终的位置
}

/**
 * 交换元素
 * @param arr
 * @param a
 * @param b
 */
function swap(arr, a, b) {
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}

function heaps(arr){
    if(arr.length<=1) return
    let length=arr.length
    while(parseInt(length=length/2)>=0){
        heapif(arr,length)
    }
    let si=length
    while(si>0){
        swap(arr,0,si)
        heapif(arr,0)
    }
}

function heapif(arr,i){
    let length=arr.length
    let value=arr[i]
    while((k=i*2+1)<length){
        if((k+1)<=length&&a[k]<a[k+1]){
            k++
        }
        if(a[k]>value){
            a[i]=a[k]
            i=k
        }
    }
    a[i]=value
}

