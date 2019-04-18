<template>
  <div class="backdrop fixed full-screen z-2 c-imgslider" v-if="visible">
      <div class="close-btn p-42 fs-36"><svg @click="closeModal" class="c-header-arrow svgIcon"><use xlink:href="#iconguanbi2"/></svg></div>
      <div class="content">
        <mt-swipe class="" @change="swipeChange" :show-indicators="false" :auto="0">
        <mt-swipe-item v-for="(item,key) in slides" :key="key">
          <img class="w-p-100" :src="item">
        </mt-swipe-item>
      </mt-swipe>
      </div>
      <div class="bottom-bar flex-row flex-h-between flex-v-center p-42">
          <div class="fs-28"><span class="cur-index">{{curIndex}}</span>/<span>{{slides.length}}</span></div>
          <div class=""><svg class="download-btn svgIcon"><use xlink:href="#iconxiazai1"/></svg></div>
      </div>
  </div>
</template>
<style lang="scss" scoped>
.c-imgslider{
  background: #fff;
}
.content{
  position:absolute;
  width: 100%;
  box-sizing:border-box;
  top:50%;
  transform:translateY(-50%);
  height:600px;
}
.close-btn{
}
.bottom-bar{
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing:border-box;
}
.cur-index{
  color:#FF5C3B;
}
.download-btn{
  fill: #333333;
  font-size:56px;
}
</style>
<script lang="ts">
import { Component, Vue, Prop,Model } from "vue-property-decorator";

@Component({})
export default class Ticket extends Vue {
  @Prop({default:[]}) slides
  @Model('change',{type:Boolean}) visible!:boolean;
  private curIndex!:number;
  data() {
    return {
      curIndex:1
    };
  }
  created() {}
  mounted() {}
  closeModal(){
    let vm=this
    vm.$emit("change")
  }
  swipeChange(index){
    let vm=this;
    vm.curIndex=index+1
  }
}
</script>
