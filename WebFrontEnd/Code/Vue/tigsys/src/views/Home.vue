<template>
  <div class="c-home home ignore">
    <!-- 头部栏 -->
    <DHeader :transparent="!isFixedFilter">
      <template v-slot:left>
        <span class="item fs-40 p-l-26">
          <svg class="c-header-arrow svgIcon">
            <use xlink:href="#iconfanhui1"></use>
          </svg>
        </span>
        <span @click="toggleLocationModal(true)" class="item location m-l-32">
          <svg class="svgIcon fs-28">
            <use xlink:href="#icondizhi1"></use>
          </svg>
          <span v-if="params.location" class="fs-22 text-ellipsis cityName">{{params.location.mchAdrCty.slice(0,-1)}}</span>
        </span>
      </template>
      <template v-slot:searchInput>
        <input v-model="params.searchStr" class="c-header-input__search fs-28" type="text" placeholder="输入商户名查找">
      </template>
      <template v-slot:right>
        <span class="fs-40 user">
          <svg class="svgIcon">
            <use xlink:href="#iconwode"></use>
          </svg>
        </span>
      </template>
    </DHeader>
    <!-- banner -->
    <div
      class="c-banner"
      :class="{'bg-shadow':!isFixedFilter}"
      :style="{paddingTop:isFixedFilter?filterHeight+'px':'0px'}"
    >
      <mt-swipe :show-indicators="false" :auto="0">
        <mt-swipe-item>
          <img class="w-p-100" src="@/static/image/banner/banner.jpg">
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <!-- 条件过滤组件 -->
    <list-filter
      v-model="params.filter"
      :isFixedFilter="isFixedFilter"
      :headerHeight="headerHeight"
      @clickFilter="onFilterClick"
    ></list-filter>
    <!-- 列表容器 -->
    <div
      class="c-list p-h-32"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
    >
      <ul>
        <Infocell :info=item v-for="(item,index) in mercList" :key="index" @click.native="checkDetail(item)"></Infocell>
      </ul>
    </div>
    <!-- 定位组件 -->
    <mt-popup
      class="full-pop-up"
      v-model="isSetLocation"
      position="right"
      popup-transition="popup-right"
      :modal="false"
    >
      <Location v-model="params.location" :locationType=locationType @close="toggleLocationModal" @reLocate=locateByGps></Location>
    </mt-popup>
    <!-- 详情页 -->
        <mt-popup
      class="full-pop-up"
      v-model="isDetailModalVisible"
      position="right"
      popup-transition="popup-right"
      :modal="false"
    >
      <detail :id=detailItemId @close="toggDetailModal"></detail>
    </mt-popup>
  </div>
</template>
<style lang="scss" scoped>
.home {
  height: 100%;
  width: 100%;
  overflow: auto;
  position: relative;
  z-index: 0;
}
.filter-fixed {
  &.home {
    background: #fff;
    color: #333333;
  }
}
.c-banner {
  height: 400px;
}
.full-pop-up {
  width: 100%;
  height: 100%;
}
</style>
<script lang="ts">
import {ILocation} from "@/types"
import { mapState } from "vuex";
import { Component, Vue, Watch } from "vue-property-decorator";
import { State, namespace } from "vuex-class";
// @ is an alias to /src
import DHeader from "@/views/Tigsys/DHeader.vue";
import Location from "@/views/Tigsys/Location.vue";
import Infocell from "@/views/Tigsys/Infocell.vue";
import ListFilter from "@/views/Tigsys/ListFilter.vue";
import detail from "@/views/Tigsys/Detail.vue";
import service from "@/service"
const configModule = namespace("config");
@Component({
  components: {
    DHeader,
    Location,
    Infocell,
    ListFilter,
    detail
  },
  computed: {}
})
export default class Home extends Vue {
  private mercList: Array<any>=[];
  private headerHeight: number = 40;
  private bannerHeight: number = 200;
  private filterHeight: number = 42;
  private isTransparent: boolean = true;
  private isFixedFilter: boolean = false;
  private scrollEle!: HTMLElement;
  private params :any= {
    location:null,
    filter: {
    location:"全部范围",
    category:"全部类型",
    activity:"全部活动",
  },
   searchStr: ""
  };
  targetParams:object={
                    "mchAdrPvn":"山东省",
                    "mchAdrCty":"烟台市",
                    "mchAdrReg":"海阳市",
                    "mchLocLng":120.173082,
                    "mchLocLat":30.186205,
                    "showInApp":"1",
                    "mchAdrBd":"宝龙城",
                    "mchTag":"炸鸡",
                    "befTyp":"01",
                    "schKeyword":""
              }
  detailItemId:string=""
  private filter: object = {}
  isSetLocation:boolean=true
  locationType:string=""
  isDetailModalVisible:boolean=false
  @configModule.Action('setLocation') setLocation
  @Watch("params.location", { deep: true })
  onLocationChanged(val, oldVal) {
    this.setLocation(val)
  }
  @Watch("params.filter", { deep: true })
  onFilterChanged(val, oldVal) {
    console.log("filter change")
  }
  @Watch("params.searchStr", { deep: true })
  onSearchStrChanged(val, oldVal) {
    console.log("searchStr change")
  }
  data() {
    return {
      mercList: [],
      isFixedFilter: false,
      isTransparent: true
    };
  }
  created() {
      this.loadData()
  }
  mounted() {
    let vm = this;
    vm.dealWithScrollEle();
    vm.calEleHeight();
    window.vbus.$emit("global.loading");
    setTimeout(() => {
      window.vbus.$emit("global.loaded");
    }, 1000);
    //获取位置信息
    this.locateByGps()
      //设置位置信息
    window.vbus.$on("global.location",(location:ILocation,locationType)=>{       
      this.locationType=locationType
      this.changeLocation(location)
    })
  }
  loadData() {
    service.getMercList(this.targetParams).then((res:any)=>{
        this.mercList.push(...res)
    })
  }
  changeLocation(location:ILocation){
      let defaultLocation:ILocation={
      mchAdrPvn:"",
      mchAdrCty:"",
      mchAdrReg:"",
      mchLocLng:"",
      mchLocLat:"",
    }
    Object.assign(defaultLocation,location)
    this.params.location=defaultLocation
    this.setLocation(this.params.location)
  }
  checkDetail(item) {
    //vm.$router.push({ path: "/detail" });
    this.detailItemId=item.mchId
    this.toggDetailModal(true)
  }
  loadMore() {
    service.getMercList(this.targetParams).then((res:any)=>{
        this.mercList.push(...res)
    })
  }
  dealWithScrollEle() {
    let vm = this;
    vm.scrollEle = document.querySelector(".home")! as HTMLElement;
    vm.scrollEle.addEventListener("scroll", vm.handlerScroll);
  }
  calEleHeight() {
    let vm = this;
    vm.headerHeight = document.querySelector(".home>.c-header")!.clientHeight;
    vm.bannerHeight = document.querySelector(".home>.c-banner")!.clientHeight;
    vm.filterHeight = document.querySelector(
      ".home>.c-filter-ct"
    )!.clientHeight;
  }
  handlerScroll(evt) {
    let vm = this;
    let ele = evt.currentTarget;
    let scrollTop = ele.scrollTop;
    if (scrollTop < vm.headerHeight) {
      vm.isTransparent = true;
    } else {
      vm.isTransparent = false;
    }
    if (scrollTop >= vm.bannerHeight - vm.headerHeight) {
      vm.isFixedFilter = true;
    } else {
      vm.isFixedFilter = false;
    }
  }
  onFilterClick() {
    let vm = this;
    vm.scrollEle.scrollTop = vm.bannerHeight - vm.headerHeight;
    vm.isFixedFilter = true;
  }
  closeFilter() {}
  onSelectFilter() {}
  toggleLocationModal(isVisible){
    this.isSetLocation=isVisible
  }
  toggDetailModal(isVisible){
    this.isDetailModalVisible=isVisible
  }
  locateByGps(){
    window.vbus.$emit('executeCmbInterface',"http://CMBLS/gps?id=123")
  }
}
</script>

