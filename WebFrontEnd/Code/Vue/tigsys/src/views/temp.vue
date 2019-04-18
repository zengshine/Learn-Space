<template>
  <div id="app">
    <!-- router-view -->
    <router-view></router-view>   
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Action, Getter } from "vuex-class";
import { ConfigState } from "@/plugins/store/types";
import config from "@/plugins/store/modules/config";
const configModuleNS: string = "config";
@Component({
  components: {
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
    vm.config.isShowHeader = false;
    vm.config.isShowFooter = false;
    vm.config.UserInfo.userId = window.urlQuery("userId") || "001";
    vm.config.UserInfo.data = window.urlQuery("data") || "001";
    vm.config.UserInfo.token = window.urlQuery("token") || "001";
  }
  mounted() {
    let vm = this;
    //滚动处理函数
    function scrollHandler() {
      let preScrollTop = document.documentElement.scrollTop;
      return function() {
        let curScrollTop = document.documentElement.scrollTop;
        let distance = curScrollTop - preScrollTop;
        if (distance < 0) {
          vm.isFooterFixed = true;
          vm.isHeaderFixed = true;
        } else {
          vm.isFooterFixed = false;
          vm.isHeaderFixed = false;
        }
        preScrollTop = curScrollTop;
      };
    }
    //注册滚动监听事件
    // document.addEventListener(
    //   "scroll",
    //   window.limit(scrollHandler(), 16, true, false)
    // );
  }
  showLeftAside() {
    let vm = this;
    vm.isShowLeftAside = true;
  }
  hideLeftAside() {
    let vm = this;
    vm.isShowLeftAside = false;
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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

