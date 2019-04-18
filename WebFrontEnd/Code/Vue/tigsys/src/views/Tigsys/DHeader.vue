<template>
  <header class="fixed-top h-64 c-header z-3" :class="{'transparent':transparent}">
    <div class="flex-row back">
        <slot name="left"></slot>
    </div>
    <div class="relative search m-l-32">
      <slot name="searchInput"></slot>
      <svg class="svgIcon input-search-icon fs-32"><use xlink:href="#iconsousuo1"/></svg>     
    </div>
    <span class="p-h-32 fs-40 user">
        <slot name="right"></slot>        
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
.cityName{
  display: inline-block;
  max-width: 75px;
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
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class vHeader extends Vue {
  @Prop({default:false}) transparent!:Boolean;
  data() {
    return {};
  }
  created() {
  }
  mounted() {}
  goBack(){
      this.$router.go(-1)
  }
}
</script>
