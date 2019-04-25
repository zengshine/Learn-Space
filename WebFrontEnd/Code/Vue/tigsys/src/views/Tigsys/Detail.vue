<template>
    <div v-if="Info" class="c-detial">
    <header class="fixed-top h-64 c-header ">
      <div @click="close" class="flex-row back">
        <span class="item fs-40 p-l-26">
          <svg class="c-header-arrow svgIcon">
            <use xlink:href="#iconfanhui1"></use>
          </svg>
        </span>
      </div>
    </header>
    <div class="detail-banner bg-shadow" @click="setImgSliderVisible">
      <img class="w-p-100" :src="Info.fstImg">
      <span class="img-count">1/{{Info.mchImgList.length}}</span>
    </div>
    <div class="cell-info p-32 m-b-20">
      <div class="name">{{Info.mchNm}}</div>
      <div class="type flex-row p-v-16">
        <span class="c-tag m-r-10" v-for="(tag,index) in Info.tagList" :key="index">{{tag}}</span>
        <!-- <span class="c-tag">炸鸡</span> -->
      </div>
      <div>
        <span class="gray-font">{{Info.mchAdrBd}}</span>
      </div>
      <div class="contact flex-row-nowrap flex-h-between m-t-28">
        <div class="fs-30 normal-font" @click="getLocation">
          <svg class="svgIcon detail-loaciton-icon">
            <use xlink:href="#icondizhi1"></use>
          </svg>
          <span class="p-l-10">{{Info.mchAdr}}</span>
        </div>
        <div class="phone p-l-26" @click="callMerc">
          <svg class="svgIcon">
            <use xlink:href="#icondianhua1"></use>
          </svg>
        </div>
      </div>
    </div>
    <div class="cell-list p-32 m-b-20">
      <div class="title">可享优惠</div>
      <ticket v-for="(item,index) in Info.befList" :key="index" :Info="item" @open="setDiscountDetailVisible(true)"></ticket>
    </div>
    <div class="p-32 des">
      <div class="title">商户简介</div>
      <p class="">
       {{Info.mchTxtDesc}}
      </p>
    </div>
    <ImgSlider :slides=Info.mchImgList v-model=isShowImgSlider @change="isShowImgSlider=false"></ImgSlider>
    <mt-actionsheet v-model="isActionSheetVisible" :actions=actionList></mt-actionsheet>
  </div>
</template>
<style lang="scss" scoped>
.c-detial{
  height: 100%;
  overflow: auto;
}
.cell-list {
  background: #fff;
}
  .title {
    height: 48px;
    font-size: 34px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 48px;
  }
.price-font {
  height: 48px;
  font-size: 34px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  line-height: 48px;
}
.c-detial {
  background: rgba(248, 248, 250, 1);
}
.des{
    background: #fff;
  p{
  font-size:32px;
font-family:PingFangSC-Regular;
color:rgba(102,102,102,1);
line-height:45px;
&::first-letter{
  padding-left: 68px;
}
  }
}
input {
  padding: 0;
}
.fa,
.fas {
  font-weight: 600;
}
.c-header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 1);
  z-index: 1;
  padding:10px 0; 
}
.c-header-arrow {
  width: 40px;
  height: 40px;
  fill: white;
}
.detail-banner {
  position: relative;
  height: 400px;
  overflow: hidden;
  .img-count {
    display: inline-block;
    position: absolute;
    z-index: 1;
    right: 30px;
    bottom: 20px;
    width: 80px;
    line-height: 32px;
    font-size: 24px;
    color: #fff;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 16px;
    text-align: center;
  }
}
.cell-info {
  background: #fff;
  .name {
    line-height: 53px;
    font-size: 38px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    line-height: 53px;
  }
  .phone {
    height: 32px;
    color: #ff5c3b;
    border-left: 1px solid rgba(221, 221, 221, 1);
  }
}
.detail-loaciton-icon{
  font-size:36px;
  fill:#999999;
}
</style>
<script lang="ts">
import { Component, Vue, Prop,Watch, Provide } from "vue-property-decorator";
import { Action } from "vuex-class";
import ticket from "@/views/Tigsys/Ticket.vue"
import ImgSlider from "@/views/Tigsys/ImgSlider.vue"
import service from "@/service"
@Component({
  components: {
    ticket,
    ImgSlider
  }
})
export default class Detial extends Vue {
  @Prop({default:""}) id
  private isShowDiscountDetail=false;
  private isShowImgSlider=false
  private Info:any
  isActionSheetVisible:boolean=false
  actionList:Array<any>=[{name:'拨打手机',method:this.doCallMerc,type:'mchCtcPhone'},{name:'拨打座机',method:this.doCallMerc,type:'mchCtcTel'}]
  @Action('setSelectedMerc') setSelectedMerc
  @Watch('id')
  onIdChanged(val,oldVal){
    if(val){
    this.loadItemInfo()
    }
  }
  data() {
    return {
      Info:null
    };
  }
  @Provide('ProvideMercId') ProvideMercId=this.getMercId
  created() {
    let vm = this;
    //this.loadItemInfo()
  }
  mounted() {}
  close() {
    this.$emit('close',false)
  }
  callMerc(){
    this.isActionSheetVisible=true
  }
  doCallMerc(){
    window.vbus.$emit("executeCmbInterface",`http://cmbiphone/call/${this.Info[arguments[0].type]}`)
    console.log(`${this.Info.mchCtcPhone}:${this.Info.mchCtcTel}`)
  }
  getLocation(){
    this.setSelectedMerc(this.Info)
    this.$router.push({name:'mapnav'});
  }
  setImgSliderVisible(){
    let vm=this
    vm.isShowImgSlider=true
  }
  loadItemInfo(){
    let vm=this
    service.getMercItem({
			"mchId":this.id
		}).then(res=>{
      vm.Info=res[0]
      console.log(res)
    })
    console.log("load item info")
  }
  getMercId(){
    let vm=this
    return vm.Info.Mch_Id
  }
}
</script>
