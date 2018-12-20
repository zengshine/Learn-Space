class Heap{
    harr // 数组，从下标1开始存储数据
    n;  // 堆的容量
    count; // 已经存储的数据的个数

    constructor(capacity){
        this.capacity=capacity+1
        this.hArr=Array(this.capacity)
        this.count=0
    }
    insert(data) {
        if (count > n) return;
        ++count;
        this.hArr[count] = data
        let i = count
        let a = this.hArr
        while (i / 2 > 0 && a[i] > a[i / 2]) {
            let temp = a[i]
            a[i] = a[i / 2]
            a[i / 2] = temp
            i = i / 2
        }
    }
    removeMax(){
        if(this.count===0) return
        this.hArr[1]=this.harr[this.count]
        this.count--
        heapify(1)
    }
    buildHeap() {
        let i=this.count/2
        while(i>0){
            this.heapify(i)
            i--
        }
    }
    heapSort(){
        this.buildHeap()
        let i=this.count
        while(i>1){
            swap(i,1)
            this.heapify(1)
            i--
        }
    }
    heapify(index){
        let i=index
        let maxpos=0
        while(i*2<=this.count)
            //先取左子树
            maxpos=index*2
            if(i*2+1<=this.count&&this.harr[i*2]<this.hArr[i*2+1]){
                //如果右子树比左
                maxpos=i*2+1
            }
            if(this.hArr[i]<this.hArr[maxpos]){
                let temp=this.hArr[maxpos]
                this.hArr[maxpos]=this.hArr[i]
                this.hArr[i]=temp
            }     
    }
}