class graph{
    v=0 //int:图定点的个数
    linkedList=[] //array: 邻接表
    constructor(v){
        this.v=v
        for(let i=0;i<v;i++){
            this.linkedList[i]=[]
        }
    }
    addEdge(s,t){
        this.linkedList[s].push(t)
        this.linkedList[t].push(s)
    }
    BFS(s,t){
        if(s===t){
            return
        }
        let visited=new Array(v)
        visited[s]=true
        let queue=new Array(v)
        queue.push(s)
        let pre=new Array(v)
        while(queue.length>0){
            let ele=this.linkedList[queue.shift()]
            for(var j=0;j<ele.length;j++){
                if(!visited[ele[j]]){
                    pre[ele[j]]=ele
                    if(ele[j]===t){
                        print(pre,s,t)
                        return
                    }
                    visited.push(ele[j])
                    queue.push(ele[j])
                }
            }
        }
    }
    prinf(pre,s,t){
        if(pre[t]!==s){
            this.prinf(pre,s,pre[t])
        }
        console.log(s)
    }
}