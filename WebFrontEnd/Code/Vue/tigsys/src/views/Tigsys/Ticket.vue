<template>
  <div v-if="Info" class="cell flex-row-nowrap m-t-20" :class="[Info.befTyp]" @click="openDetail">
    <div class="cell-left flex-row-nowrap p-20">
      <div class="name juan flex flex-h-v-center"></div>
      <div class="cell-info p-l-12">
        <div class="normal-font p-t-10 text-ellipsis">{{Info.befNm}}</div>
        <div class="gray-font text-ellipsis">{{Info.befDesc}}</div>
        <div v-show="Info.befTyp=='SMJ'||Info.befTyp=='STM'" class="price price-font">￥{{Info.befPrice}}</div>
      </div>
    </div>
    <div class="cell-right flex flex-h-v-center">
      <div class="cell-btn"></div>
    </div>
    <DiscountDetail :params=params :isShow=isShowDiscountDetail  @close="setDiscountDetailVisible(false)"></DiscountDetail>
  </div>
</template>
<style lang="scss" scoped>
.cell {
  box-sizing: border-box;
  height: 160px;
  background-size: 100% 100%;
  &.FMJ{
      background-image: url("../../static/image/icons/oranget.svg");
      .name {
      background: #FF5C3B;
      &::before {
        content: "券";
      }
    }
    .cell-btn::before{
        content: "领取";
        color: #ff5c3b;
    }
  }
  &.SMJ{
      background-image: url("../../static/image/icons/bluet.svg");
      .name {
      background: #34B0F3;
      &::before {
        content: "惠";
      }
    }
    .cell-btn::before{
        content: "详情";
        color: #34B0F3;
    }
    .price{
      color:#34B0F3;
    }
  }
    &.FLJ{
      background-image: url("../../static/image/icons/yellowt.svg");
      .name {
      background: #FFB148;
      &::before {
        content: "券";
      }
    }
    .cell-btn::before{
        content: "购买";
        color: #ff5c3b;
    }
    .price{
      color:#FFB148;
    }
  }
    &.STM{
      background-image: url("../../static/image/icons/greent.svg");
      .name {
      background: #35CDAE;
      &::before {
        content: "团";
      }
    }
    .cell-btn::before{
        content: "购买";
        color: #35CDAE;
    }
    .price{
      color:#35CDAE;
    }
  }
}
  .cell-left {
    box-sizing: border-box;
    width: 534px;
    .cell-info {
      flex: 1;
      width: 0;
    }
  }
    .cell-right {
      width: 160px;
  }
      .cell-btn {
      width: 100px;
      height: 50px;
      line-height: 50px;
      background: rgba(255, 255, 255, 1);
      border-radius: 25px;
      text-align: center;
    }
  .name{
      width: 120px;
      height: 120px;
      border-radius: 4px;
      font-size: 48px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
  }
  .price{
    font-weight:bold;
  }
</style>
<script lang="ts">
import { Component, Vue, Prop,Inject } from "vue-property-decorator";
import DiscountDetail from "@/views/Tigsys/DiscountDetail.vue"
@Component({
  components:{
    DiscountDetail
  }
})
export default class Ticket extends Vue {
  @Prop() Info
  private params={
    befBeanId:"",
    befTyp:"",
    mchId:""
  }
  isShowDiscountDetail:boolean=false
  data() {
    return {
    };
  }
  @Inject('ProvideMercId') getMercId
  created() {
  }
  mounted() {}
  openDetail(){
      let vm=this;
      switch(this.Info.befTyp){
        case 'SMJ':
        this.setDiscountDetailVisible(true);
        this.params.befBeanId=this.Info.befBeanId
        this.params.befTyp=this.Info.befTyp
        this.params.mchId=this.getMercId()     
        break;
        case 'SMG':
        window.location=this.Info.Bef_Tkin_Url;
        break;
        default:break;
      }
  }
  setDiscountDetailVisible(visible){
    this.isShowDiscountDetail=visible;
  }
}
</script>
