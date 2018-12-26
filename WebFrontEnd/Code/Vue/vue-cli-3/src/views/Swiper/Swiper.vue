<template>
  <div class="router-swiper">
    <!-- Slider main container -->
    <div class="swiper-container">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
        <!-- Slides -->
        <!-- slide-1 -->
        <div class="swiper-slide bg1">
          <MeteorShower></MeteorShower>
          <div class="p1-username">
            <span>张三</span>
          </div>
          <div class="p1-main-tex">
            <transition
              v-for="(item,index) in pageAnime.p0.text"
              :key="index"
              :enter-active-class="item.animatedClass"
            >
              <div :class="[item.cssClass]" v-if="item.isVisible">{{item.text}}</div>
            </transition>
          </div>
          <div id="animeEarth" class="w-f anime-ct"></div>
        </div>
        <!-- slide 2 -->
        <div class="swiper-slide">
          <SnowShower></SnowShower>
        </div>
        <!-- slide 3 -->
        <div class="swiper-slide bg1">
          <div id="animeRoute" class="w-f anime-ct"></div>
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
import { promises } from "fs";
import { resolve } from "url";
import { setTimeout } from "timers";

import SnowShower from "@/components/display/SnowShower.vue";
import MeteorShower from "@/components/display/MeteorShower.vue";
const configModuleNS: string = "config";
const adata = require("@/static/json/data1.json");
const userId = "001";
@Component({
  components: {
    SnowShower,
    MeteorShower
  }
})
export default class Home extends Vue {
  @State(configModuleNS) config!: ConfigState;
  private mySwiper: any;
  private pageAnime: any;
  private isSlideChange: boolean = false;
  private animePromise: any;
  private animeData: any;
  private data() {
    let lottieAnime0 = {
      isInit: false,
      animeData: [
        {
          selector: "#animeEarth",
          path: "/json/earth.json"
        }
      ]
    };
    let lottieAnime2 = {
      isInit: false,
      animeData: [
        {
          selector: "#animeRoute",
          path: "/json/licheng.json"
        }
      ]
    };
    return {
      pageAnime: {
        p0: {
          text: [
            new pageText("2018年,", "fs-36 lh-50", "fadeInDown", false),
            new pageText("你踏上了新的征途", "fs-24 lh-33", "fadeInDown", false)
          ],
          anime: lottieAnime0
        },
        p2: {
          anime: lottieAnime2
        }
      },
      animePromise: Promise.resolve(),
      animeData: {}
    };
  }
  beforeCreate() {
    let vm = this;
  }
  created() {
    const vm = this;
    vm.config.isShowHeader = false;
    vm.config.isShowFooter = false;
    vm.$ajax.get(`/api/data?userid=${userId}`).then(res => {
      console.log(res);
    });
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
    //data init
    //init ct size
    const swiperPage: HTMLElement | null = document.querySelector(
      ".router-swiper"
    );
    swiperPage!.style.height = window.innerHeight + "px";
    //init swiper
    vm.mySwiper = new Swiper(".swiper-container", {
      // Optional parameters
      direction: "vertical",
      //loop: true,
      pagination: {
        el: ".swiper-pagination"
      },
      on: {
        init: () => {
          vm.$nextTick(() => {
            this.animationExec(vm.pageAnime.p0);
          });
        },
        slideChange: () => {
          vm.resetPrePage();
        }
      }
    });
  }
  bodyMoving() {}
  resetPrePage() {
    let vm = this;
    let prePageData: any =
      (vm.pageAnime[`p${vm.mySwiper.previousIndex}`] || {})["text"] || [];
    prePageData.forEach(element => {
      element.isVisible = false;
    });
    this.animationExec(vm.pageAnime[`p${vm.mySwiper.realIndex}`] || []);
  }
  animationExec(dataO: object) {
    let vm = this;
    let index = vm.mySwiper.realIndex;
    let pageData = vm.pageAnime[`p${index}`] || {};
    let anime = pageData["anime"];
    //lottie animation
    if (anime && !anime.isInit) {
      vm.$nextTick(() => {
        let animeData = anime.animeData[0];
        let opts = {
          container: document.querySelector(animeData.selector),
          renderer: "svg",
          loop: true,
          autoplay: true
          //animationData: require("@/static/json/data1.json")
        };
        var animation = window.bodymovin.loadAnimation(
          Object.assign(opts, animeData)
        );
        anime.isInit = true;
      });
    }
    //text animation
    let textData = pageData["text"] || [];
    for (let i = 0; i < textData.length; i++) {
      vm.animePromise = vm.animePromise.then(() => {
        return new Promise(resolve => {
          setTimeout(resolve, 700);
        }).then(() => {
          if (vm.mySwiper.realIndex == index) textData[i].isVisible = true;
        });
      });
    }
  }
}
</script>
<style>
.swiper-container {
  width: 100%;
  height: 100%;
  font-family: Helvetica;
}
.bg1 {
  background-image: url("../../static/image/slidesBg/bg.jpg");
  background-size: 100%;
}
.p1-username {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 62px;
  width: 98px;
  height: 98px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-image: linear-gradient(45deg, #8e20e1, #9b26e9 35%, #deaab4); */
  background-image: linear-gradient(
    56deg,
    rgba(202, 33, 232, 0.05) 27%,
    rgba(255, 255, 255, 0.7) 98%
  );
  z-index: 1;
  font-size: 24px;
}
.p1-main-tex {
  position: absolute;
  left: 39px;
  top: 172px;
  z-index: 1;
}
.anime-ct {
  position: absolute;
  min-height: 300px;
  bottom: 0;
  z-index: 1;
  font-size: 0;
  transform: translateZ(0);
}
</style>
<style lang="scss" src="" scoped>
</style>


