
//underscore _其实是一个经典得[无new]构造函数
let _=function(obj){
    if(obj instanceof _) return obj
    if(!(this instanceof _)) return new _(obj)
    this._wrapped=obj
}
//可向underscore函数库扩展自己的方法
_.mixin = function(obj) {
    // 遍历 obj 的 key，将方法挂载到 Underscore 上
    // 其实是将方法浅拷贝到 _.prototype 上
    _.each(_.functions(obj), function(name) {
      // 直接把方法挂载到 _[name] 上
      // 调用类似 _.myFunc([1, 2, 3], ..)
      var func = _[name] = obj[name];
  
      // 浅拷贝
      // 将 name 方法挂载到 _ 对象的原型链上，使之能 OOP 调用
      _.prototype[name] = function() {
        // 第一个参数
        var args = [this._wrapped];
  
        // arguments 为 name 方法需要的其他参数
        push.apply(args, arguments);
        // 执行 func 方法
        // 支持链式操作
        return result(this, func.apply(_, args));
      };
    });
  };

  //Add all mutator Array functions to the wrapper
  _.each(['pop','push','shift','unshift','splice','sort','reverse'],function(name){
      let method=ArrayProto[name]
      _.prototype[name]=function(){
        let obj=this._wrapped
        method.apply(obj,arguments)
        if((name==='shift'||name==='splice')&&obj.length===0){
            delete obj[0]
        }
      }
  })
  _.prototype.chain=function(obj){
      var instance=_(obj)
      instance.chain=true
      return instance
  }
  //Helper function to continue chaining intermediate result
  let result=function(instance,obj){
      //如果需要链式操作，则对obj运行chain方法，使得可以继续后续的链式操作
      return instance.chain?_(obj).chain():obj;
  }
  //往有序数组中的插入特定元素，要求插入元素后数组任然保持有序，找出该插入位置
  _.sortedIndex=function(arr,value){
      let low=0
      let high=arr.length
      let mid=0
      while(low<high){
        let mid=Math.floor((low+high)/2)
        if(arr[mid]>value){
            high=mid--
        }else{
            low=mid++
        }   
      }
      return low
  }
  //An internal function for creating assigner functions
  function createAssigner(keysFunc,undefinedOnly){
      return function(){
          let des=arguments[0]
          for(let i=1;i<arguments.length;i++){
              let source=arguments[1]
              let keys=keysFunc(source)
              for(let j=0;j<keys.length;j++){
                  let key=keys[j]
                  des[key]=source[key]
              }
          }
          return des
      }
  }
  //strict equal
  function equal(a,b){
      if(a===b){
          return !(a===0&&1/a==1/b)
      }else{
          return a!==a&&b!==b
      }
  }
  //bind pollify
  _.bind=function(func,context){
      let nativeBind=Function.prototype.bind     
      if(nativeBind&&func.bind===nativeBind){
          return nativeBind.apply(func,[].slice.call(arguments,1))
      }
      let args=[].slice.call(this.arguments,2)
      let bind=function(){
          if(this instanceof bind){
            //当把该函数当作是构造函数来使用时
            //let self=Object.create(func.prototype)
            let f=function(){}
            let self=new f()
            self.prototype=func.prototype
            sourceFunc.apply(self,args.concat(arguments))
          }
          func.apply(context,args.concat(arguments))
      }
  }

  //execution bound function:Determines whether to execute a function as a constructor
  //or a normal function with the provided arguments
  let executieBound=function(sourceFunc,boundFunc,context,callingContext,args){
      if(callingContext instanceof boundFunc){
          let f=function(){}
          let self=new f()
          self.prototype=sourceFunc.prototype
          result=sourceFunc.apply(self,args)
      }else{
        result= sourceFunc.apply(context,args)
      }
      return result
  }
  //Partially apply a function by creating a version that has had some of its
  //arguments pre-filled,without changing its dynamic "this" context._ acts as a placeholder
  function partial(func){
      var boundArgs=[].slice.call(arguments,1)
      let bound=function(){
          let position=0,length=boundArgs.length
          let args=Array(arguments.length)
          for(let i=0;i<length;i++){
              args[i]=boundArgs[i]===_?arguments[position++]:boundArgs[i]
          }
          while(position<arguments.length){
              args.push(boundArgs[position++])
          }
          return executieBound(func,bound,this,this,args)         
      }
  }
  function partial(func){
      let originArg=[].slice.call(arguments,1)
      var partFn=function(){
          let args=[].slice.call(arguments)
          if(args.length<originArg.length){
              let inPartFn=function(){
                  return partFn.apply(this,args.concat(arguments))
              }
            return  inPartFn
          }else{
              return func.apply(this,args.concat(arguments))
          }
      }
      return partFn
  }
  function add(){
      let result=0
      for(let i=0;i<arguments.length;i++){
          result+=arguments[i]
      }
      console.log(result)
  }
  partial(add,1,1,1)
