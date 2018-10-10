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