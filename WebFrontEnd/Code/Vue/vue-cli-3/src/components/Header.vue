<template>
    <header class="app-header" :style="{height:height+'px',lineHeight:height+'px'}">
        <span class="header-bars"><i class="fas fa-bars"></i></span>
        <span class="header-title">Title</span>
        <div></div>
    </header>
</template>
<script lang="ts">
import { Component,Vue,Prop} from "vue-property-decorator";

@Component({})
export default class vHeader extends Vue{
    private heights?:number
    @Prop({default:100}) height!:number
    data(){
        return{
        heights:0
        }
    }
    created() {
     let vm=this
     console.log("created")   
    }
    mounted() {
             
    }
}
</script>
<style scoped>
header{
    background: darkred;
    color: #fff;
}
.header-bars{
    font-size: 20px;
    margin:0 1em 0 .75em
}
.header-title{
    font-size: 22px;
    font-weight: bold;
}
</style>
