Vue.component("ProvideComponnet",{
    provide:function(){
        return {
            provideFn:this.provideFn
        }
    },
    data(){
        return{
            ready:false,
            info:{}
        }
    },
    methods:{
        provideFn(fn){
            if(this.ready){
                fn(this.info)
            }else{
                new Promise((resolve,reject)=>{
                    setTimeout(()=>{
                        this.ready=true
                        this.provideFn(fn)
                    },1000)
                })
            }
        }
    }
})

Vue.component("ProvideComponnet",{
    inject:['provideFn'],
    data(){
        return{
        }
    },
    created () {
        vm.provideFn(function(info){
            console.log(info)
        })
    }
})