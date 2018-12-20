var limit =function(func,wait,isDebounce){
	var timeout=null,startTime=0
	return function(){
		var context=this
		var args=[].slice.call(arguments)
		var throttler=function(){
			startTime=new Date()
			timeout=null
			func.apply(context,args)
		}
		if(isDebounce){		
			if(leading){
			var now=new Date()
		     if(now-startTime>=wait){
			  throttler()
			}else{
				startTime=new Date()
			}
			}else{
			  clearTimeout(timeout)
			  timeout=setTimeout(throttler,wait)
			}
		}
		if(isDebounce||!timeout){
			timeout=setTimeout(throttler,wait)
		}
	}
}

_.throttle=function(func,wait){
	return limit(func,wait,false)
}
_.debounce=function(func,wait){
	return limit(func,wait,true)
}
setTimeout(function(){
	console.log("set timemout first")
	asyncFir()
},0)
setTimeout(function(){
	console.log("set timemout second")
},0)
async function asyncFir(){
	 console.log("async start");
	 await asyncSec().then(suc=>{console.log(suc)})
	 console.log("async end");
}
async function asyncSec(params) {
	console.log("asyncSec")
	makePromise()
	return "res:asyncSec"
}
function makePromise(){
	new Promise(resolve=>{
		resolve(Promise.resolve())
		console.log("Promise")
	}).then(()=>{
		console.log("Promise then")
	})
}