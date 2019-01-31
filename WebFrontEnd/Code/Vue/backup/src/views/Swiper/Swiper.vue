<template>
  <div class="router-swiper">
    <!-- Slider main container -->
    <div class="swiper-container">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
        <!-- Slides -->
        <!-- slide-1 -->
        <div class="swiper-slide bg">
          <MeteorShower :isPlaying="SwiperInstance.realIndex==0"></MeteorShower>
          <div class="p0-username">
            <span>{{userData.Name&&userData.Name.split('|')[0]}}</span>
          </div>
          <div class="p0-main-tex">
            <VText :data="pageAnime.p0.text"></VText>
          </div>
          <div id="animeEarth" class="w-f anime-ct"></div>
        </div>
        <!-- slide 2 -->
        <div class="swiper-slide bg">
          <!-- <SnowShower></SnowShower> -->
          <div class="p1-main-text">
            <VText :data="pageAnime.p1.text"></VText>
          </div>
          <div id="animeRoute" class="w-f anime-ct"></div>
        </div>
        <!-- slide 3 -->
        <div class="swiper-slide bg">
          <div class="p2-main-text">
            <VText :data="pageAnime.p2.text"></VText>
          </div>
          <div id="workout" class="w-f anime-ct"></div>
        </div>
        <!-- slide 4 -->
        <div class="swiper-slide bg">
          <div class="p3-main-text">
            <VText :data="pageAnime.p3.text"></VText>
          </div>
          <div id="overTime" class="w-f anime-ct"></div>
        </div>
        <!-- slide 5 -->
        <div class="swiper-slide bg">
          <div class="p4-main-text">
            <VText :data="pageAnime.p4.text"></VText>
          </div>
          <div id="wishes" class="w-f anime-ct"></div>
        </div>
        <!-- slide 6 -->
        <div class="swiper-slide bg">
          <div class="p5-main-text">
            <VText :data="pageAnime.p5.text"></VText>
          </div>
          <div id="doubleeleven" class="w-f anime-ct"></div>
        </div>
        <!-- slide 7 -->
        <div class="swiper-slide bg" :class="{'constellationmasker':!isDivine}">
          <MeteorShower :isShowMeteor="false" :isPlaying="SwiperInstance.realIndex==6"></MeteorShower>
          <div class="p6-main-text">
            <VText :data="pageAnime.p6.text"></VText>
          </div>
          <transition leave-active-class="animated fadeOutRightBig">
            <div v-if="!isDivine" key="1">
              <div class="divineBtn" @click="onDivine">开始占卜</div>
              <div id="Constellation" class="w-f anime-ct"></div>
            </div>
            <div v-if="isDivine" key="2">
              <div class="radarChartCt">
                <div id="radarChart" style="width:100%;height:250px;"></div>
              </div>
              <div class="p6-Constellation-text">
                <VText :data="pageAnime.p6.ConstellationText"></VText>
              </div>
            </div>
          </transition>
        </div>
        <!-- slide 8 -->
        <div class="swiper-slide bg">
          <div class="p7-main-text">
            <VText :data="pageAnime.p7.text"></VText>
          </div>
          <div id="newYear" class="w-f anime-ct"></div>
        </div>
      </div>
      <!-- If we need pagination -->
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Swiper from "swiper";
import * as echarts from "echarts/lib/echarts";
import "echarts/lib/chart/radar";

import { State, Action, Getter } from "vuex-class";
import { Component, Vue } from "vue-property-decorator";

import SnowShower from "@/components/display/SnowShower.vue";
import MeteorShower from "@/components/display/MeteorShower.vue";
import VText from "@/components/display/TransitionText.vue";

import { ConfigState } from "@/store/types";
import { radarOption } from "@/static/js/Data/echartOptions.ts";
import {
  swiperPageData,
  ConstellationText,
  localUsData
} from "@/static/js/Data/swiper.ts";
import { pageText } from "@/types";
import { setTimeout } from "timers";

const configModuleNS: string = "config";
@Component({
  components: {
    SnowShower,
    MeteorShower,
    VText
  }
})
export default class Home extends Vue {
  @State(configModuleNS) config!: ConfigState;
  private userData: any;
  private SwiperInstance: any;
  private pageAnime: any;
  private isSlideChange: boolean = false;
  private animePromise: any;
  private animeData: any;
  private isDivine: boolean = false;
  private data() {
    return {
      pageAnime: swiperPageData,
      SwiperInstance: {},
      animePromise: Promise.resolve(),
      animeData: {},
      userData: {}
    };
  }
  beforeCreate() {
    let vm = this;
  }
  created() {
    const vm = this;
    vm.config.isShowHeader = false;
    vm.config.isShowFooter = false;
    vm.$ajax
      .get(`/api/datas?userid=${vm.config.UserInfo.userId}`)
      .then(res => {
        vm.userData = res;
        console.log(res);
        vm.initTextData();
      })
      .catch(err => {
        //fake data
        vm.userData = localUsData;
        vm.initTextData();
      });
  }
  mounted() {
    let vm = this;
    //hide loading page
    let loadEle = document.querySelector(".loader") as HTMLElement;
    loadEle.style.display = "none";
    vm.$nextTick(() => {
      this.init();
      //vm.SwiperInstance.slideTo(6);
    });
  }
  computed() {}
  initTextData() {
    let vm = this;
    if (vm.userData.IsLeader) vm.pageAnime.p2.text = vm.pageAnime.p2.textSp;
    if (!vm.userData.Mile) vm.pageAnime.p1.text = vm.pageAnime.p1.textSp;
    Object.entries(vm.pageAnime).forEach((item: any) => {
      Array.isArray(item[1].text) &&
        item[1].text.forEach(textItem => {
          textItem.text = textItem.text.replace(
            /(\{\{(\w{1,})\}\})/g,
            (m, m1, m2) => {
              return vm.userData[m2];
            }
          );
        });
    });
    vm.pageAnime.p6.ConstellationText = ConstellationText.c1;
  }
  init() {
    const vm = this;
    //init ct size
    const swiperPage: HTMLElement | null = document.querySelector(
      ".router-swiper"
    );
    swiperPage!.style.height = window.innerHeight + "px";
    //init swiper
    vm.SwiperInstance = new Swiper(".swiper-container", {
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
  resetPrePage() {
    let vm = this;
    let prePageData: any =
      vm.pageAnime[`p${vm.SwiperInstance.previousIndex}`] || {};
    let preTextData = prePageData.text || [];
    let preAnime = prePageData.anime || {};
    preTextData.forEach(element => {
      element.isVisible = false;
    });
    preAnime.aniItem && preAnime.aniItem.stop();
    this.animationExec(vm.pageAnime[`p${vm.SwiperInstance.realIndex}`] || []);
  }
  animationExec(dataO: object) {
    let vm = this;
    let index = vm.SwiperInstance.realIndex;
    let slideData = vm.pageAnime[`p${index}`] || {};
    let anime = slideData["anime"];
    //lottie animation
    vm.animateLottie(anime);
    //text animation
    let textData = slideData["text"] || [];
    vm.animateText(textData);
  }
  animateLottie(anime) {
    let vm = this;
    if (anime && anime.animeData) {
      vm.$nextTick(() => {
        if (!anime.isInit) {
          let animeData = anime.animeData[0];
          let opts = {
            container: document.querySelector(animeData.selector),
            renderer: "svg",
            loop: true,
            autoplay: true
          };
          anime.aniItem = window.bodymovin.loadAnimation(
            Object.assign(opts, animeData)
          );
          anime.isInit = true;
        } else {
          anime.aniItem.play();
        }
      });
    }
  }
  animateText(textData) {
    let vm = this;
    let animePromise = Promise.resolve();
    for (let i = 0; i < textData.length; i++) {
      animePromise = animePromise.then(() => {
        return new Promise(resolve => {
          setTimeout(resolve, i == 0 ? 0 : 500);
        }).then(() => {
          textData[i].isVisible = true;
        });
      });
    }
    return animePromise;
  }
  onDivine() {
    let vm = this;
    let textData = vm.pageAnime[`p${vm.SwiperInstance.realIndex}`];
    textData.text.forEach(item => {
      item.isVisible = false;
    });
    vm.isDivine = true;
    vm.$nextTick(() => {
      textData.text = textData.textSp;
      let thenableObj = vm.animateText(textData.text);
      thenableObj.then(() => {
        setTimeout(() => {
          let ctx = document.querySelector("#radarChart");
          let myChart = echarts.init(ctx);
          myChart.setOption(radarOption);
          vm.animateText(textData.ConstellationText);
        }, 1000);
      });
    });
  }
}
</script>
<style lang="scss" scoped>
.swiper-container {
  width: 100%;
  height: 100%;
  font-family: Helvetica;
}
.bg {
  background-image: url("../../static/image/slidesBg/bg-v1.jpg");
  background-size: cover;
}
.bg1::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.constellationmasker::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.constellationmasker::after {
  content: "";
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 1px;
  box-shadow: 0 0px 60px 120px rgba(0, 0, 0, 0.4);
}
.p0-username {
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
    rgba(202, 33, 232, 0.05) 30%,
    rgba(255, 255, 255, 0.7) 75%
  );
  z-index: 1;
  font-size: 24px;
}
.text-top {
  top: 72px;
}
@media (max-height: 568px) {
  .text-top {
    top: 36px;
  }
}
.main-text {
  @extend .text-top;
  position: absolute;
  z-index: 2;
  left: 36px;
}
.p0-main-tex {
  @extend .main-text;
  top: 172px;
}
.p1-main-text {
  @extend .main-text;
}
.p2-main-text {
  @extend .main-text;
  left: 0;
  width: 100%;
  text-align: center;
}
.p3-main-text {
  @extend .main-text;
}
.p4-main-text {
  @extend .main-text;
  left: 0;
  width: 100%;
  text-align: center;
}
.p5-main-text {
  @extend .main-text;
}
.p6-main-text {
  @extend .main-text;
  top: 36px;
  left: 0;
  width: 100%;
  text-align: center;
}
.p6-Constellation-text {
  @extend .p6-main-text;
  top: 405px;
  box-sizing: border-box;
  padding: 0 10%;
  text-align: justify;
}
.p7-main-text {
  @extend .main-text;
}
.anime-ct {
  position: absolute;
  min-height: 300px;
  bottom: 0;
  z-index: 1;
  font-size: 0;
  transform: translateZ(0);
}
.divineBtn {
  position: absolute;
  z-index: 2;
  width: 100px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
  bottom: 50px;
  background-color: rgba(89, 197, 197, 0.75);
}
.radarChartCt {
  position: absolute;
  width: 100%;
  top: 132px;
}
</style>
<style>
.p4-gradient-text {
  display: inline-block;
  background-image: -webkit-linear-gradient(0deg, #ff81ed 0%, #73fad9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>



