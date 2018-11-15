export default class Dep{
    static target;
    id;
    subs;
    constructor(){
        this.id=uid++
        this.subs=[]
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    removeSub(watcher){
        remove(this.subs,watcher)
    }
    depend(){
        if(Dep.target){
            Dep.target.addDep(this)
        }
    }
    notify(){
        //stabilize the subscriber list first
        const subs=this.subs.slice()
        for(let i=0,l=subs.length;i<l;i++){
            subs[i].update()
        }
    }
}

Dep.target=null
const targetStack=[]

export function pushTarget(watcher){
    if(Dep.target){
        targetStack.push(Dep.target)
    }
    Dep.target=watcher
}

export function popTarget(){
    Dep.target=targetStack.pop()
}

nextTick(flushSchedulerQueue)
