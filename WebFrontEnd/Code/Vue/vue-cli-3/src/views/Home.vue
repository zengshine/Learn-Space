<template>
  <div class="home ignore">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { Component,Vue} from "vue-property-decorator";

import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {
  data () {
    return {
     
    }
  }
  mounted() {
  }
  getData() {
    this.$ajax({
      url: "/api/Site?parentid=0&deep=1&userId=admin",
      method: "get",
    }).then(function(data:any){
      console.log("home:getData,success")
    });
  }
}
</script>
<style>
.home{
  height: 1000px;
}
</style>

