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
          <span
            v-if="params.location"
            class="fs-22 text-ellipsis cityName"
          >{{params.location.mchAdrCty.slice(0,-1)}}</span>
        </span>
      </template>
      <template v-slot:searchInput>
        <input
          v-model="params.searchStr"
          class="c-header-input__search fs-28"
          type="text"
          placeholder="输入商户名查找"
        >
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
      :options="filterTypes"
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
          <!-- 测试代码 -->
      <ul>
        <li @click="locateByGps" class="p-32">定位测试a</li>
        <li @click="makePhoneCall" class="p-32">电话拨打测试</li>
      </ul>
      <ul>
        <Infocell
          :info="item"
          v-for="(item,index) in mercList"
          :key="index"
          @click.native="checkDetail(item)"
        ></Infocell>
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
      <Location
        v-model="params.location"
        :locationType="locationType"
        @close="toggleLocationModal"
        @reLocate="locateByGps"
      ></Location>
    </mt-popup>
    <!-- 详情页 -->
    <mt-popup
      class="full-pop-up"
      v-model="isDetailModalVisible"
      position="right"
      popup-transition="popup-right"
      :modal="false"
    >
      <detail :id="detailItemId" @close="toggDetailModal"></detail>
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
import { ILocation } from "@/types";
import { mapState } from "vuex";
import { Component, Vue, Watch } from "vue-property-decorator";
import { State, namespace } from "vuex-class";
// @ is an alias to /src
import DHeader from "@/views/Tigsys/DHeader.vue";
import Location from "@/views/Tigsys/Location.vue";
import Infocell from "@/views/Tigsys/Infocell.vue";
import ListFilter from "@/views/Tigsys/ListFilter.vue";
import detail from "@/views/Tigsys/Detail.vue";
import service from "@/service";
const configModule = namespace("config");
interface filter{
  type:string,
  location: any,
  category: any,
  activity: any
}
interface paramsType{
    mchAdrPvn: string,
    mchAdrCty: string,
    mchAdrReg: string,
    mchLocLng: number,
    mchLocLat: number,
    showInApp: string,
    mchAdrBd: string,
    mchTyp: string,
    befTyp: string,
    schKeyword:string
}
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
  private mercList: Array<any> = [];
  private headerHeight: number = 40;
  private bannerHeight: number = 200;
  private filterHeight: number = 42;
  private isTransparent: boolean = true;
  private isFixedFilter: boolean = false;
  private scrollEle!: HTMLElement;
  private filterTypes: any;
  private params: any = {
    location: null,
    filter: {
      type:"",
      location: "",
      category: "",
      activity: ""
    },
    searchStr: ""
  };
  targetParams: paramsType = {
    mchAdrPvn: "",
    mchAdrCty: "深圳市",
    mchAdrReg: "",
    mchLocLng: 0,
    mchLocLat: 0,
    showInApp: "1",
    mchAdrBd: "",
    mchTyp: "00",
    befTyp: "ALL",
    schKeyword: ""
  };
  detailItemId: string = "";
  private filter: object = {};
  isSetLocation: boolean = true;
  locationType: string = ""; //当前定位信息的获取方法：历史使用，gps定位
  isDetailModalVisible: boolean = false;
  @configModule.Action("setLocation") setLocation;
  @Watch("params.location", { deep: true })
  onLocationChanged(val, oldVal) {
    console.log("location change");
    //更改vuex location
    this.setLocation(val);
    //更改过滤条件中的位置信息
    this.setParamsLocation(this.params.location)
    this.loadData()
  }
  @Watch("params.filter", { deep: true })
  onFilterChanged(val:filter, oldVal) {
    console.log("filter change");
    this.setParamsFilter(val)
    if(val.type=="category"){
      this.loadData("APPQUERYMCHLISTBYMCHTYP")
    }else if(val.type=="activity"){
      this.loadData("APPQUERYMCHLISTBYBEFTYP")
    }
  }
  @Watch("params.searchStr", { deep: true })
  onSearchStrChanged(val, oldVal) {
    console.log("searchStr change");
    //防抖或节流函数优化
    this.setParamsSearch(val)
    this.loadData('APPQUERYMCHLISTBYSEARCH')
  }
  data() {
    return {};
  }
  created() {
    this.initFilter();
    this.loadData();
  }
  mounted() {
    let vm = this;
    vm.dealWithScrollEle();
    vm.calEleHeight();
    //获取位置信息
    this.locateByGps();
    //设置位置信息
    window.vbus.$on("global.location", (location: ILocation, locationType) => {
      this.locationType = locationType;
      this.changeLocation(location);
      this.isSetLocation=false
    });
  }
  initFilter(){
    let vm=this
    //过滤数据暂时采取直接本地数据的方式
    this.filterTypes= {
        location: {
          name: "范围",
          data: [
            {name:'全部范围',value:''},
          ]
        },
        category: {
          name: "类型",
          data: [
            {name:'全部类型',value:'00'},
            {name:'餐饮',value:'04'},
            {name:'商超',value:'06'}
          ]
        },
        activity: {
          name: "活动",
          data: [
            {name:'全部活动',value:'ALL'},
            {name:'免费一网通支付券',value:'FMJ'},
            {name:'优惠活动',value:'FLJ'},
            {name:'有偿一网通支付券',value:'SMJ'},
            {name:'团购套餐',value:'STM'},
          ]
        }
      }
      //生成初始值
      Object.keys(this.filterTypes).forEach(key=>{
        vm.params.filter[key]=vm.filterTypes[key].data[0]||[]
      })
  }
  loadData(command="APPQUERYMCHLIST") {
    let vm=this
    service.getMercList(command,this.targetParams).then((res: any) => {
      vm.mercList=res
    })
  }
  loadMore() {
    //后台接口未实现分页加载逻辑
    // service.getMercList(this.targetParams).then((res: any) => {
    //   this.mercList.push(...res);
    // });
  }
  changeLocation(location: ILocation) {
    //获取定位信息
    // let defaultLocation!: ILocation
    // Object.assign(defaultLocation, location);
    this.params.location = location;
    //暂保存到vuex,但其实没有全局共享的逻辑
    this.setLocation(this.params.location);
  }
  setParamsLocation(location:ILocation){
    this.targetParams.mchAdrPvn=location.mchAdrPvn||"" //后台接口可能有bug,不能传undefined,必须传空字符串
    this.targetParams.mchAdrCty=location.mchAdrCty||""
    this.targetParams.mchAdrReg=location.mchAdrReg||""
    this.targetParams.mchLocLng=location.mchLocLng
    this.targetParams.mchLocLat=location.mchLocLat
  }
  setParamsFilter(filter:filter){
    this.targetParams.mchAdrBd=filter.location.value
    this.targetParams.mchTyp=filter.category.value
    this.targetParams.befTyp=filter.activity.value
  }
  setParamsSearch(searchStr){
    this.targetParams.schKeyword=searchStr
  }
  checkDetail(item) {
    //vm.$router.push({ path: "/detail" });
    this.detailItemId = item.mchId;
    this.toggDetailModal(true);
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
  toggleLocationModal(isVisible) {
    this.isSetLocation = isVisible;
  }
  toggDetailModal(isVisible) {
    this.isDetailModalVisible = isVisible;
  }
  locateByGps() {
    //id：功能标识
    //maptype：	地图类型： bd 表示使用百度地图定位，gd表示使用高德地图定位。默认值为bd
    //usecache：是否使用缓存
    window.vbus.$emit("executeCmbInterface", "http://cmbls/gps?id=123&usecache=false&maptype=gd");
  }
  makePhoneCall(){
    //得判断userAgent
    window.vbus.$emit("executeCmbInterface",`http://cmbandroid/call/1388088880`)
  }
}
</script>

