function scrollSmoothTo(position,times){
    if(!window.requestAnimationFrame){
        window.requestAnimationFrame=function(cb,ele){
            return setTimeout(cb,17)
        }
    }
    //当前滚动高度
    let scrollTop=document.documentElement.scrollTop||document.body.scrollTop
    let distance=position-scrollTop
    function step(){       
        //目标滚动距离
        scrollTop+=distance/times
        if(Math.abs(scrollTop-position)<Math.abs(distance/times)){
            window.scrollTo(0,position)
        }else{
            window.scroll(0,scrollTop)
            requestAnimationFrame(step)
        }       
    }
    step()
}