<template>
  <div class="router-swiper">
    <!-- Slider main container -->
    <div class="swiper-container">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
        <!-- Slides -->
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>...
      </div>
      <!-- If we need pagination -->
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {State, Action, Getter} from 'vuex-class'
import { Component, Vue } from "vue-property-decorator";

import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

import Swiper from "swiper";
import { ConfigState } from '@/store/types';
const configModuleNS:string='config'
@Component({
  components: {}
})
export default class Home extends Vue {
  @State(configModuleNS) config!:ConfigState
  private mySwiper: any;
  created () {
      const vm=this
      vm.config.isShowHeader=false
      vm.config.isShowFooter=false
  }
  mounted() {
    this.init();
  }
  computed(){   
  }
  init() {
    const vm = this;
    //init ct size
    const swiperPage = <HTMLElement>document.querySelector(".router-swiper");
    //If you know from external means that an expression is not null or undefined, you can use the non-null assertion operator ! to coerce away those types:
    swiperPage!.style.height = window.innerHeight + "px";
    //init swiper
    vm.mySwiper = new Swiper(".swiper-container", {
      // Optional parameters
      direction: "vertical",
      loop: true,
      // If we need pagination
      pagination: {
        el: ".swiper-pagination"
      }
    });
  }
  getData() {
    this.$ajax({
      url: "/api/Site?parentid=0&deep=1&userId=admin",
      method: "get"
    }).then(function(data: any) {
      console.log("home:getData,success");
    });
  }
}
</script>
<style>
.swiper-container {
  width: 100%;
  height: 100%;
}
</style>

