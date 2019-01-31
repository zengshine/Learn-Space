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
          <div :class="{'p4-main-text-lead':isTopLeader,'p4-main-text':!isTopLeader}">
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
        <div class="swiper-slide bg overflow-h" :class="{'constellationmasker':!isDivine}">
          <div v-if="!isDivine" key="1">
            <MeteorShower :isShowMeteor="false" :isPlaying="SwiperInstance.realIndex==6"></MeteorShower>
            <div class="p6-main-text">
              <VText :data="pageAnime.p6.text"></VText>
            </div>
            <transition leave-active-class="animated fadeOutRightBig">
              <div>
                <div class="divineBtn" @click="onDivine">开始占卜</div>
                <div id="Constellation" class="w-f anime-ct"></div>
              </div>
              <div v-if="false" key="3">
                <div class="radarChartCt">
                  <div id="radarChart" style="width:100%;height:250px;"></div>
                </div>
                <div class="p6-Constellation-text">
                  <VText :data="pageAnime.p6.ConstellationText"></VText>
                </div>
              </div>
            </transition>
          </div>
          <div class="constellation-pic" v-if="isDivine" key="2">
            <div
              id="constellationPicAnime"
              class="w-f anime-ct"
              :style="{bottom:cAnimeStyle.bottom+'vw',width:cAnimeStyle.width+'vw'}"
            ></div>
          </div>
        </div>
        <!-- slide 8 -->
        <div class="swiper-slide bg overflow-h">
          <div class="p7-main-text">
            <VText :data="pageAnime.p7.text"></VText>
          </div>
          <div id="newYear" class="w-f anime-ct"></div>
          <transition enter-active-class="animated bounceInDown" @after-enter="afterEnter">
            <div v-if="isShowRedPacket" class="redpacket" @click="goToRedPacketPage"></div>
          </transition>
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

//import SnowShower from "@/components/display/SnowShower.vue";
import MeteorShower from "@/components/display/MeteorShower.vue";
import VText from "@/components/display/TransitionText.vue";

import { ConfigState } from "@/store/types";
import { radarOption } from "@/static/js/Data/echartOptions.ts";

import {
  swiperPageData,
  ConstellationText,
  localUsData,
  cAnimeOption,
  rppURL
} from "@/static/js/Data/swiper.ts";
import { pageText } from "@/types";
import { setTimeout } from "timers";

const configModuleNS: string = "config";
@Component({
  components: {
    //SnowShower,
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
  private ConstellationData: any;
  private isDivine: boolean = false;
  private isShowRedPacket: boolean = false;
  private isTopLeader: boolean = false;
  private cAnimeStyle: any;
  private data() {
    return {
      pageAnime: swiperPageData,
      SwiperInstance: {},
      animePromise: Promise.resolve(),
      animeData: {},
      userData: {},
      cAnimeStyle: {
        width: 100,
        bottom: 0
      }
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
      .get(`/api/data?year=2018&userId=${vm.config.UserInfo.userId}`)
      .then(res => {
        vm.userData = res;
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
    vm.calConstellationAnime();
    vm.$nextTick(() => {
      this.init();
      //vm.SwiperInstance.slideTo(6);
    });
  }
  computed() {}
  calConstellationAnime() {
    let vm = this;
    let bottom = 0;
    let width = 100;
    let sH = window.innerHeight;
    let sW = window.innerWidth;
    let animeRatio = 1334 / 750;
    let screenRatio = sH / sW;
    if (screenRatio >= animeRatio) {
      bottom = ((screenRatio - animeRatio) * 100) / 2;
    } else {
      // width = (width * screenRatio) / animeRatio;
    }
    vm.cAnimeStyle.bottom = bottom;
    vm.cAnimeStyle.width = width;
  }
  afterEnter() {
    document.querySelector(".redpacket")!.classList.add("animated", "swing");
  }
  goToRedPacketPage() {
    let vm = this;
    window.location.href = `${rppURL}&userid=${
      vm.config.UserInfo.userId
    }&username=${vm.userData.Name}`;
  }
  initTextData() {
    let vm = this;
    if (vm.userData.IsLeader) {
      vm.pageAnime.p2.text = vm.pageAnime.p2.textSp;
      vm.pageAnime.p3.text = vm.pageAnime.p3.textSp;
    }
    if (vm.userData.OverTime == 0) {
      vm.pageAnime.p3.text = vm.pageAnime.p3.textSp2;
    }
    if (vm.userData.withoutChange) {
      vm.pageAnime.p2.text = vm.pageAnime.p2.textSp2;
    }
    if (!vm.userData.Mile) {
      vm.pageAnime.p1.text = vm.pageAnime.p1.textSp;
    }
    if (vm.config.UserInfo.userId == "00010672") {
      vm.isTopLeader = true;
      vm.pageAnime.p4.text = vm.pageAnime.p4.textSp;
    }
    //确定星座
    let sIndex = ConstellationText.signs.indexOf(vm.userData.Sign);
    if (sIndex <= -1) {
      sIndex = Math.floor(Math.random() * ConstellationText.signs.length);
      vm.pageAnime[`p${6}`].textSp = vm.pageAnime[`p${6}`].textSp2;
    }
    vm.ConstellationData = ConstellationText[`c${sIndex}`];
    vm.pageAnime.p6.ConstellationText = vm.ConstellationData.text;
    Object.values(vm.pageAnime).forEach((item: any) => {
      Object.values(item).forEach((tItem: any) => {
        Array.isArray(tItem) &&
          tItem.forEach(textItem => {
            textItem.text = textItem.text.replace(
              /(\{\{(\w{1,})\}\})/g,
              (m, m1, m2) => {
                return vm.userData[m2];
              }
            );
          });
      });
    });
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
    if (vm.SwiperInstance.realIndex == 7) {
      setTimeout(() => {
        vm.isShowRedPacket = true;
      }, 800);
    }
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
    //configabel interval
    let interval = 0;
    let animePromise = Promise.resolve();
    for (let i = 0; i < textData.length; i++) {
      animePromise = animePromise.then(() => {
        return new Promise(resolve => {
          setTimeout(resolve, i == 0 ? 0 : interval);
        }).then(() => {
          textData[i].isVisible = true;
        });
      });
    }
    return animePromise;
  }
  onDivine() {
    let vm = this;
    let animePath = vm.ConstellationData.cAnime;
    cAnimeOption.animeData[0].path = animePath;
    vm.isDivine = true;
    vm.$nextTick(() => {
      vm.animateLottie(cAnimeOption);
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
.constellation-pic {
  width: 100%;
  height: 100%;
  background-image: url("../../static/image/slidesBg/conpicbg1.jpg");
  background-size: cover;
  position: relative;
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
.walkingMan {
  position: absolute;
  z-index: 2;
  width: 100px;
  height: 200px;
  left: 50%;
  bottom: 21.5vw;
  transform: translateX(-66%);
  animation-name: walkingM;
  animation-duration: 1000ms;
  animation-iteration-count: infinite;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.text-top {
  top: 72px;
}
.redpacket {
  width: 100px;
  height: 130px;
  position: absolute;
  z-index: 2;
  right: 35px;
  top: 80px;
  background-image: url("../../static/image/slidesBg/redpacket.png");
  background-size: cover;
}
@media (max-height: 568px) {
  .text-top {
    top: 36px;
  }
  .redpacket {
    width: 85px;
    height: 110px;
    position: absolute;
    z-index: 2;
    right: 35px;
    top: 70px;
    background-image: url("../../static/image/slidesBg/redpacket.png");
    background-size: cover;
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
  box-sizing: border-box;
  padding: 0 15%;
  text-align: center;
}
.p4-main-text-lead {
  @extend .main-text;
  top: 36px;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 8%;
  text-align: left;
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
  left: 50%;
  transform: translateX(-50%) translateZ(0);
}
.divineBtn {
  position: absolute;
  z-index: 5;
  width: 65%;
  height: 38px;
  line-height: 38px;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
  bottom: 45px;
  background-color: rgba(55, 200, 255, 0.95);
  border-radius: 4px;
}
.radarChartCt {
  position: absolute;
  width: 100%;
  top: 132px;
}
@keyframes walkingM {
  0% {
    background-image: url("../../static/image/gift/m1.png");
  }
  25% {
    background-image: url("../../static/image/gift/m2.png");
  }
  50% {
    background-image: url("../../static/image/gift/m3.png");
  }
  75% {
    background-image: url("../../static/image/gift/m4.png");
  }
  100% {
    background-image: url("../../static/image/gift/m1.png");
  }
}
</style>
<style>
.gradient-text {
  display: inline-block;
  background-image: -webkit-linear-gradient(0deg, #ff81ed 0%, #73fad9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.swiper-pagination-bullet-active {
  background: #fff;
}
.p4-main-text-lead p {
  margin: 10px 0;
}
</style>



