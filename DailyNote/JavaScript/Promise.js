//promise 构造函数

var promise=new Promise(function(resolve,reject){
    var flag=true
    //something async
    setTimeout(function(){
        //deal with flag
        if(flag){
            resolve(true)
        }else{
            reject(false)
        }
    },1000)
})

//promise 调用

promise.then(function(res){
    dealWithRes(res)
}).catch(function(err){
    dealWithErr(err)
})