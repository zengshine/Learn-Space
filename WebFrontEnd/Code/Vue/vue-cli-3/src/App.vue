<template>
  <div id="app">
    <div id="nav">
      <vHeader :height="barHeight"></vHeader>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>
<script lang="ts">
import { Component,Vue} from "vue-property-decorator";
import vHeader from "@/components/Header.vue"
@Component({
  components:{
    vHeader
  }
})
export default class app extends Vue{
  data(){
    return {
      barHeight:45
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<style>
@import url("../src/static/css/reset.css");
</style>
<style lang="scss" src="../src/static/scss/variable.scss"></style>

