<custom-input v-model="inputText"></custom-input>

`<custom-input v-bind:value="inputText" v-on:input="inputText=$event"></custom-input>`

    Vue.Component('custom-input',{
       props:['value'],
       template:`
       <input v-bind:value="value" v-on:input="$emit('input',$event.target.value)"
       `
    })

    var componentA={},
    var componentB={},
    var vm=new Vue({
        el:"#app",
        components:{
            componentA,
            componentB
        }    
    })
