function Observablee(){
    this.Observers=[]
}
Observablee.prototype={
    addObserver(observer){
        this.Observers.push(observer)
    },
    notifyObserver(){
        this.Observers.forEach((observer)=>{
            observer.update()
        })
    }
}

function defineReactive(data,key,val){
   //递归构建所有属性 
    observe(val)
    var Observable=new Observablee()
    Object.defineProperty(data,key,{
        enumerable:true,
        configurable:true,
        get(){
            console.log('get:'+val)
            if(Observablee.target){
                Observable.Observers.push(Observablee.target)
            }
            return val
        },
        set(newVal){
            if(val==newVal){
                return
            }
            val=newVal
            Observable.notifyObserver()
            console.log('set:'+newVal)
        }
    })
}

function observe(data){
    if(!data||Object.prototype.toString.apply(data).slice(8,-1)!='Object'){
        return
    }else{
        Object.keys(data).forEach(function(key){
            defineReactive(data,key,data[key])
        })
    }
}

// var data={
//     a:'string',
//     b:false,
//     c:5,
//     d:{
//         a:'Object'
//     }
// }
// observe(data)
// var get=data.a
// data.b=true
// var getObj=data.d.a  