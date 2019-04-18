<template>
<div class="c-location relative">
<DHeader>
    <template v-slot:left>
      <span @click="close" class="item fs-40 p-l-26">
        <svg class="c-header-arrow svgIcon"><use xlink:href="#iconfanhui1"/></svg>
      </span>
    </template>
    <template v-slot:searchInput>
      <input v-model="searchText" class="c-header-input__search fs-28" type="text" placeholder="输入城市名">
    </template>     
    <template v-slot:right>
      <span @click="close" class="fs-28">取消</span>
    </template>
</DHeader>
<div class="index-list-ct">
   <indexlist :offsetTop="200" v-show="!searchText">
    <div class="location-tag">
          <div v-if="location">
           <p class="tag-title m-t-30">当前</p>
           <div class="tagitem-ct flex-row">
             <div @click="setLocationByGps" class="tag-item tag-item-width m-t-20 flex flex-h-v-center">
               <div>
                 <svg class="svgIcon fs-28"><use xlink:href="#icondizhi1"/></svg>
                 <span>{{"深圳"}}</span>
               </div>
             </div>
             <div v-if="locationType=='history'" class="flex flex-h-v-center m-t-20 p-l-10 fs-24">
               <span class="color-gray">上次访问</span>
             </div>
             <div v-if="locationType=='gps'" @click="reLocation" class="flex flex-h-v-center m-t-20 p-l-10 fs-24">
               <span class="color-red">重新定位</span>
             </div>
           </div>
         </div>
         <div v-if="!location" class="p-30 flex flex-h-v-center">
           <span class="color-gray">获取GPS定位失败，请选择城市</span>
         </div>
         <div>
           <p class="tag-title m-t-30">热门城市</p>
           <div class="tagitem-ct flex-row flex-h-between">
             <div class="tag-item tag-item-width m-t-20 flex flex-h-v-center" @click="setLocation(city)" v-for="(city,index) in originCities.hot" :key="index">
               {{city.regionName}}
             </div>
             <div class="tag-item-width"></div>
             <div class="tag-item-width"></div>
             <div class="tag-item-width"></div>
           </div>
         </div>
     </div>
  <indexsection v-for="(okey,index) in Object.keys(originCities.all)" :index=okey :key="index">
    <mt-cell v-for="(city,index) in originCities.all[okey]" :key=index @click.native="setLocation(city)" :title=city.regionName></mt-cell>
  </indexsection>
</indexlist>
  <ul class="search-list" v-show="searchText">
    <a  class="mint-cell"  v-for="(city,index) in searchCityList" :key="index"  @click="setLocation(city)"> 
      <div class="mint-cell-left"></div> 
      <div class="mint-cell-wrapper">
        <div class="mint-cell-title"> 
          <span class="mint-cell-text"> {{city.regionName}}</span>
          </div> 
          <div class="mint-cell-value">
          <span></span></div></div> 
          <div class="mint-cell-right"></div>
        </a>    
  </ul>
</div>
</div>
</template>
<style lang="scss" scoped>
.c-location{
    height: 100%;
}
.index-list-ct{
    position: absolute;
    top: 104px;
    right: 0;
    left: 0;
    bottom: 0;
}
.location-tag{
  padding: 30px; 
}
.location-switcher{
    height: 400px;
}
.color-gray{
  color:rgba(187,187,187,1);
}
.color-red{
  color:#FF5C3B;
}
.tag-title{
  font-size:30px;
  color:rgba(153,153,153,1);
  line-height:42px;
}
.tag-item{
  height:70px;
  min-width: 25%;
  border-radius:4px;
  border:1px solid rgba(221,221,221,1);
  box-sizing: border-box;
}
.tag-item-width{
  min-width: 30%;
}
.mint-cell-wrapper{
  font-size: 14px;
}
.mint-indexsection-index{
  background: #fff;
  color:rgba(153,153,153,1);
}
.mint-indexlist-navitem{
  color: #0862a6;
}
.search-list{
  height: 100%;
  overflow: auto;
}
</style>

<script lang="ts">
import { Component, Vue, Prop,Model } from "vue-property-decorator";
import {mapState} from "vuex"
import {Action, namespace} from "vuex-class"
const CityJson = require("@/static/json/city.json")
import service from "@/service"
import DHeader from "@/views/Tigsys/DHeader.vue"
import Indexlist from "@/components/IndexList/Indexlist.vue"
import Indexsection from "@/components/IndexList/Indexsection.vue"
const configmodule=namespace('config')
@Component({
  components: {
    DHeader,
    Indexlist,
    Indexsection
  },
})
export default class Detial extends Vue {
  @Prop({default:false}) isShow!: boolean;
  @Prop({default:""}) locationType
  @Model('change') location;
  private originCities
  private citisList
  private searchText
  data() {
    return {
      originCities:CityJson,
      searchText:"",
      citisList:[]
    };
  }
  get searchCityList(){
    return this.citisList.filter(city=>{
      return city.regionName.indexOf(this.searchText)>-1
    })
  }
  beforeCreate () {
  }
  created() {
    console.log(this.location)
    this.generateCitieList()
  }
  mounted() {}
  generateCitieList(){
    for(let cityArr of Object.values(this.originCities.all)){
      this.citisList.push(...(cityArr as Array<string>))
    } 
  }
  close(){
    this.$emit("close",false)
  }
  goBack(){
    this.$router.go(-1)
  }
  setLocation(location){
    let tempLocation=Object.assign({},this.location)
    tempLocation.mchAdrCty=location.regionName
    this.$emit('change',tempLocation)
    this.close()
  }
  setLocationByGps(){
    let tempLocation=Object.assign({},this.location)
  }
  reLocation(){
    this.$emit('reLocate')
  }
}
</script>
