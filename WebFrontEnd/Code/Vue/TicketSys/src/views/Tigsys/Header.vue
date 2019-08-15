<template>
  <header class="fixed-top h-64 c-header" :class="{'transparent':transparent}">
    <div class="flex-row back">
      <span class="item fs-40 p-l-26">
        <svg class="c-header-arrow svgIcon"><use xlink:href="#iconfanhui1"/></svg>
      </span>
      <span @click="toSetLocation" class="item p-h-32 location">
        <svg class="svgIcon fs-28"><use xlink:href="#icondizhi1"/></svg>
        <span class="fs-22">深圳</span>
      </span>
    </div>
    <div class="relative search">
      <input class="c-header-input__search fs-28" type="text" placeholder="输入商户名查找">
      <svg class="svgIcon input-search-icon fs-32"><use xlink:href="#iconsousuo1"/></svg>     
    </div>
    <span class="p-h-32 fs-40 user">
      <svg class="svgIcon"><use xlink:href="#iconwode"/></svg>     
    </span>
  </header>
</template>
<style lang="scss" scoped>
input {
  padding: 0;
}
.fa,.fas{
    font-weight: 600;
}
.c-header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
  padding:20px 0px;
  background:#fff;
  color:#333;
}
.transparent{
  &.c-header{
    background:none;
    color:#fff;
  }
  & .c-header-input__search{
    background: rgba(255, 255, 255, .4);
    color:#fff;
    &::placeholder{
    color:currentColor;
  }
  }
}
.c-header-arrow{
    width: 40px;
    height: 40px;
}
.search{
  flex: 1 1 auto;
}
.c-header-input__search {
  display: inline-block;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  padding-left: 60px;
  border: 0 none;
  border-radius: 30px;
  color:#999;
  background: rgba(255, 255, 255, .4);
  background:rgba(248,248,250,1);
  outline: 0 none;
  &::placeholder{
    color:currentColor;
  }
}
.input-search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-60%);
}
.location {
  display: flex;
  flex-flow: column;
  text-align: center;
}
</style>
<script lang="ts">
import { Component, Vue, Prop, Model } from "vue-property-decorator";
import {State,Action,namespace} from "vuex-class"
import DHeader from "@/views/Tigsys/DHeader.vue"
const configModule=namespace('config')
@Component({
  components:{DHeader}
})
export default class vHeader extends Vue {
  @Prop({default:true}) transparent!:Boolean;
  @configModule.Action('toggleLocationModal') toggleLocationModal
  @Model ('change',{type:Object}) location
  data() {
    return {}
  }
  created() {
  }
  mounted() {}
  toSetLocation(location){
    this.$emit('change',location)
    this.$emit('close')
  }
}
</script>
