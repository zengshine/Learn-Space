<template>
  <div class="router-swiper">
    <!-- Slider main container -->
    <div class="swiper-container">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
        <!-- Slides -->
        <div class="swiper-slide">
          <canvas id="bgCanvas"></canvas>
          <canvas id="terCanvas"></canvas>
        </div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>...
      </div>
      <!-- If we need pagination -->
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Swiper from "swiper";

import { State, Action, Getter } from "vuex-class";
import { Component, Vue } from "vue-property-decorator";
import { ConfigState } from "@/store/types";

import { MeteorShower } from "@/utils/MeteorShower";

const configModuleNS: string = "config";
@Component({
  components: {}
})
export default class Home extends Vue {
  @State(configModuleNS) config!: ConfigState;
  private mySwiper: any;
  created() {
    const vm = this;
    vm.config.isShowHeader = false;
    vm.config.isShowFooter = false;
  }
  mounted() {
    this.init();
  }
  computed() {}
  init() {
    const vm = this;
    //init ct size
    const swiperPage: HTMLElement | null = document.querySelector(
      ".router-swiper"
    );
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
    this.meteorShower();
  }
  meteorShower() {
    let MeteorCount = 4;
    // Terrain stuff.
    const terrain: HTMLCanvasElement = document.getElementById(
      "terCanvas"
    ) as HTMLCanvasElement;
    const background: HTMLCanvasElement = document.getElementById(
      "bgCanvas"
    ) as HTMLCanvasElement;
    const terCtx = terrain.getContext("2d")!;
    const bgCtx = background.getContext("2d")!;
    let width = window.innerWidth;
    let height = document.body.offsetHeight;
    height = height < 400 ? 400 : height;
    terrain.width = background.width = width;
    terrain.height = background.height = height;
    // Second canvas used for the stars
    bgCtx.fillStyle = "#05004c";
    bgCtx.fillRect(0, 0, width, height);
    let MSInstance = new MeteorShower(background, bgCtx);
    MSInstance.drawBg(terrain, terCtx);
    MSInstance.start();
  }
}
</script>
<style>
.swiper-container {
  width: 100%;
  height: 100%;
}
canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

