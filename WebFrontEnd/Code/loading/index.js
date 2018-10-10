window.addEventListener("load",function(){
    Vue.component('loading',{
        template:"#loading",
        props: {
            dotNums:{
                type:Number,
                required:true,
                default:10
            },
            dotRadius:{
                type:Number,
                required:true,
                default:10
            },
            loadingRadius:{
                type:Number,
                required:true,
                default:100 
            }
        },
        methods: {
            positionTransform(dot,dotNums){
              let vm=this
              let index=--dot
              let rad=(360*index/dotNums)/(180/Math.PI)
              let x=Math.cos(rad)*vm.loadingRadius
              let y=Math.sin(rad)*vm.loadingRadius
              return {
                  transform:`translate(${x}px,${y}px)`
              }
            },
            animationTransform(dot,dotNums){
              let vm=this
              let index=--dot
              let delay=index/dotNums
              return {
                  animationDelay:`${delay}s`
              }
              
            }
        }
    })
    
    let app=new Vue({
        el:"#app",
        data(){
           return {
               loadingRadius:100,
           }
        }
    })
})