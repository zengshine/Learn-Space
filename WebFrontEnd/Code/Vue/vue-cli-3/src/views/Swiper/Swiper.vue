<template>
  <div class="router-swiper">
    <!-- Slider main container -->
    <div class="swiper-container">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
        <!-- Slides -->
        <!-- slide-1 -->
        <div class="swiper-slide">
          <canvas id="bgCanvas"></canvas>
          <canvas id="terCanvas"></canvas>
          <div class="p1-username">
            <span>张三</span>
          </div>
          <div class="p1-main-tex">
            <transition
              v-for="(item,index) in pageText.p0"
              :key="index"
              :enter-active-class="item.cssClass"
            >
              <div v-if="item.isVisible">{{item.text}}</div>
            </transition>
            <!-- <div>已经是过去式</div>
            <div>回首365个日夜</div>
            <div>你付出的汗水</div>
            <div>数据中心看得见</div>-->
          </div>
        </div>
        <!-- slide 2 -->
        <div class="swiper-slide">
          <SnowShower></SnowShower>
        </div>
        <div class="swiper-slide">
          <div id="animeB" class="w-h-full"></div>
        </div>
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
import { pageText } from "@/types";

import { MeteorShower } from "@/utils/MeteorShower";
import { promises } from "fs";
import { resolve } from "url";
import { setTimeout } from "timers";

import SnowShower from "@/components/display/SnowShower.vue";
const configModuleNS: string = "config";
const adata = require("@/static/json/data1.json");
@Component({
  components: {
    SnowShower
  }
})
export default class Home extends Vue {
  @State(configModuleNS) config!: ConfigState;
  private mySwiper: any;
  private pageText: any;
  private isSlideChange: boolean = false;
  private animePromise: any;
  private animeData: any;
  private data() {
    return {
      pageText: {
        p0: [
          new pageText("2017,", "fadeInDown", false),
          new pageText("已经是过去式,", "fadeInDown", false),
          new pageText("回首365个日夜,", "fadeInDown", false),
          new pageText("你付出的汗水,", "fadeInDown", false),
          new pageText("数据中心看得见,", "fadeInDown", false)
        ]
      },
      animePromise: Promise.resolve(),
      animeData: {}
    };
  }
  beforeCreate() {
    let vm = this;
    console.log(adata);
  }
  created() {
    const vm = this;
    vm.config.isShowHeader = false;
    vm.config.isShowFooter = false;
  }
  mounted() {
    let vm = this;
    vm.$nextTick(() => {
      this.init();
    });
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
      //loop: true,
      // If we need pagination
      pagination: {
        el: ".swiper-pagination"
      },
      on: {
        init: () => {
          vm.$nextTick(() => {
            this.animationExec(vm.pageText.p0);
          });
        },
        slideChange: () => {
          vm.resetPrePage();
          if (vm.mySwiper.realIndex == 2) {
            vm.$nextTick(() => {
              vm.bodyMoving();
            });
          }
        }
      }
    });
    this.meteorShower();
  }
  bodyMoving() {
    let vm = this;
    var animation = window.bodymovin.loadAnimation({
      container: document.getElementById("animeB"),
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: require("@/static/json/data1.json")
    });
  }
  resetPrePage() {
    let vm = this;
    let prePageData: any = vm.pageText[`p${vm.mySwiper.previousIndex}`] || [];
    prePageData.forEach(element => {
      element.isVisible = false;
    });
    this.animationExec(vm.pageText[`p${vm.mySwiper.realIndex}`] || []);
  }
  animationExec(dataO: Array<pageText>) {
    let vm = this;
    let index = vm.mySwiper.realIndex;
    let data = vm.pageText[`p${index}`] || [];
    for (let i = 0; i < data.length; i++) {
      vm.animePromise = vm.animePromise.then(() => {
        return new Promise(resolve => {
          setTimeout(resolve, 700);
        }).then(() => {
          if (vm.mySwiper.realIndex == index) data[i].isVisible = true;
        });
      });
    }
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
    let terCtx = terrain.getContext("2d")!,
      bgCtx = background.getContext("2d")!,
      width = window.innerWidth,
      height = document.body.offsetHeight;
    height = height < 400 ? 400 : height;
    terrain.width = background.width = width;
    terrain.height = background.height = height;
    let MSInstance = new MeteorShower(background, bgCtx, terrain, terCtx, 5);
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
.p1-username {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 50px;
  width: 75px;
  height: 75px;
  background: pink;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, #0a0554, #05004c 35%, #deaab4);
  z-index: 1;
  font-size: 22px;
}
.p1-main-tex {
  position: absolute;
  line-height: 34px;
  left: 30px;
  top: 155px;
}
</style>
<style lang="scss" src="" scoped>
</style>


