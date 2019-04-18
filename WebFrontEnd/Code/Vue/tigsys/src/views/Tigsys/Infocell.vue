<template>
        <li class="c-cell flex-row-nowrap p-v-40">
          <div class="cell-avatar">
            <img :src="info.logoImg">
          </div>
          <div class="cell-info p-l-20">
            <div class="cell-name">{{info.mchNm}}</div>
            <div class="m-v-20">
              <span class="cell-type c-tag m-l-10" v-for="(tag,index) in info.tagList" :key="index">{{tag}}</span>
              <span class="cell-area p-l-30">{{info.mchAdrBd}}</span>
            </div>
            <ul>
              <li class="cell-ticket p-b-8" v-for="(ticket,index) in info.befList" :key="index">
                <span class="cell-ticket-icon">券</span>
                <span
                  class="cell-ticket-name p-l-10 text-ellipsis"
                >{{ticket.befNm}}</span>
              </li>
            </ul>
          </div>
        </li>
</template>
<style lang="scss" scoped>
  .c-cell {
    border-bottom: 0.5px solid rgba(221, 221, 221, 0.85);
    .cell-avatar {
      img {
        width: 160px;
        height: 160px;
        border-radius:8px; 
      }
    }
    .cell-info {
      flex: 1 1 auto;
      width: 0;
    }
    .cell-name {
      font-size: 32px;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: rgba(51, 51, 51, 1);
      line-height: 45px;
    }
    .cell-area {
      font-size: 24px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 33px;
    }
    .cell-ticket:last-child{
      padding-bottom: 0;
    }
    .cell-ticket-icon {
      display: inline-block;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 20px;
      border-radius: 50%;
      background: rgba(255, 92, 59, 1);
      color: #fff;
      vertical-align: middle;
    }
    .cell-ticket-name {
      display: inline-block;
      width: calc(100% - 40px);
      font-size: 20px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 32px;
      vertical-align: middle;
    }
  }
</style>
<script lang="ts">
import { Component, Vue, Prop,Model } from "vue-property-decorator";

@Component({})
export default class Ticket extends Vue {
  @Prop() isShow!: boolean;
  @Prop() info!: object;
  @Model('change',{type:Boolean}) visible!:boolean;
  private curIndex!:number;
  data() {
    return {
      curIndex:1
    };
  }
  created() {}
  mounted() {}
  closeModal(){
    let vm=this
    vm.$emit("change")
  }
  swipeChange(index){
    let vm=this;
    vm.curIndex=index+1
  }
}
</script>
