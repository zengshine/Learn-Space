function reverse(linkH){
    let head=null
    let temp=null
    head=linkH
    while(linkH!=null){
        head=linkH
        head.next=temp
        temp=linkH
        linkH=linkH.next
    }
    return head
}
//利用快慢指针找出链表的终点
function findMiddle(linkH){
    let slow=linkH
    let fast=linkH
    while(fast&&fast.next){
        slow=slow.next
        fast=fast.next.next
    }
    return slow
}