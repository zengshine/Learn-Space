<template>
    <header class="app-header" :style="{height:height+'px',lineHeight:height+'px'}">
        <div class="header-sticky" :style="{height:height+'px',lineHeight:height+'px'}" :class="{fixed:isHeaderFixed}">
          <span class="header-bars" @click="showLeftAside()"><i class="fas fa-bars"></i></span>
          <span class="header-title">Title</span>
        </div>       
    </header>
</template>
<script lang="ts">
import { Component,Vue,Prop} from "vue-property-decorator";

@Component({})
export default class vHeader extends Vue{
    private heights?:number
    @Prop({default:100}) height!:number
    @Prop() isHeaderFixed:boolean=true
    data(){
        return{
        heights:0
        }
    }
    created() {
     let vm=this 
    }
    mounted() {
             
    }
    showLeftAside(){
        let vm=this
        vm.$emit('showLeftAside')
    }
}
</script>
<style scoped>
.header-sticky{
    top: 0;
    left: 0;
    right: 0;
    background: darkred;
    color: #fff;
}
.header-bars{
    font-size: 20px;
    margin:0 1em 0 .75em;
}
.header-title{
    font-size: 22px;
    font-weight: bold;
}
</style>
