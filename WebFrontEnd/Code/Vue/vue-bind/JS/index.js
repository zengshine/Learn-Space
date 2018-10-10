window.addEventListener('load',function(){
    var ele=document.querySelector("#model");
    vue=new sVue({
        el:"#app",
        data:{
            model:'hello vue',
            title:'vTitle',
            name:'vName'
        },
        mounted() {
            var vm=this
            setTimeout(function(){
                vm.title='vTitle-change'
            },2000)
        },
        methods:{
           onClick(){
               console.log("click")
           }
        },
    })
})