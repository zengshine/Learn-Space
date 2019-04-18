<template>
  <div id="app">
    <!-- router-view -->
    <transition>
      <keep-alive exclude="mapnav">
        <router-view></router-view>
      </keep-alive>     
    </transition>
    <globalEvent></globalEvent>   
  </div>
</template>

<style lang="scss">
#app {
  font-family:"Microsoft YaHei","PingFangSC-Regular", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
<style lang="scss" src="../src/static/scss/style.scss"></style>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Action, Getter } from "vuex-class";
import globalEvent from "@/components/Function/globalEvent.vue"
import { ConfigState } from "@/plugins/store/types";
import config from "@/plugins/store/modules/config";
const configModuleNS: string = "config";

@Component({
  components: {
    globalEvent
  }
})
export default class app extends Vue {
  @State(configModuleNS) config!: ConfigState;
  private isShowLeftAside?: boolean;
  private isFooterFixed?: boolean = false;
  private isHeaderFixed?: boolean = false;
  data() {
    return {
      barHeight: 45,
      isShowLeftAside: false
    };
  }
  created() {
    let vm = this;
  }
  mounted() {
    let vm = this;
  }
}
</script>

