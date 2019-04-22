<template>
  <div class="backdrop fixed full-screen z-2" v-if="isShow">
      <div class="content relative">
          <div class="name">{{Info.befNm}}</div>
          <div class="info relative">
           <div class="t-center">
              <span class="dot"></span>
              <span class="title">活动详情</span>
          </div>
          <div class="flex flex-h-center">
          <div>
          <div class="plan">活动时间：{{Info.actvStartDt}}~{{Info.actvEndDt}} </div>
          <div class="plan">参与方式：{{Info.befDesc}}</div>
          </div>
          </div>
          <div class="regular-title m-t-55">具体规则：</div>
          <div class="regular m-t-15">
          <div>{{Info.dtlRule}} </div>
          </div>
          <div class="close-btn" @click="closeModal"><svg class="c-header-arrow svgIcon"><use xlink:href="#iconguanbi3"/></svg></div>
          </div>          
      </div>
  </div>
</template>
<style lang="scss" scoped>
.content{
    width: 650px;
    margin: auto;
    margin-top: 100px;
    padding-top:355px; 
    background-image:url('../../static/image/icons/adetail.svg');
    background-size:100%;
    background-repeat:no-repeat;    
}
.name{
position:absolute;
top:200px;
width:100%;
text-align:center;
height:56px;
font-size:40px;
font-family:PingFangSC-Semibold;
font-weight:600;
color:rgba(255,255,255,1);
line-height:56px;
}
.dot{
    display: inline-block;
    width:29px;
height:29px;
margin-right: 15px;
border-radius: 50%;
background:linear-gradient(180deg,rgba(255,149,109,1) 0%,rgba(255,49,7,1) 100%);
}
.info{
background-color:#fff;
padding: 30px;
color:rgba(51,51,51,1);
border-radius:8px;
.title{
    height:50px;
font-size:36px;
line-height:50px;
font-weight: bold;
}
.plan{
font-size:30px;
color:rgba(51,51,51,1);
line-height:42px;
}
.regular-title{
    height:45px;
font-size:32px;
line-height:45px;
}
.regular{
font-size:30px;
color:rgba(102,102,102,1);
line-height:42px;
max-height:600px;
overflow:auto;
}    
div{
    margin-bottom: 15px;
}
}
.close-btn{
    position: absolute;
    width: 60px;
    height: 60px;
    font-size:60px;
    left: 50%;
    bottom: -110px;
    transform: translate(-50%);
    color:#fff;
}
</style>
<script lang="ts">
import { Component, Vue, Prop,Watch, Inject } from "vue-property-decorator";
import service from "@/service"

@Component({})
export default class Ticket extends Vue {
  @Prop() isShow!: boolean;
  @Prop({default:{}}) params
  private Info={}
  data() {
    return {};
  }
  @Watch('params',{deep:true})
  onParamsChange(){
      console.log("params change")
      this.loadDetail()
  }
  created() {}
  mounted() {}
  closeModal(evt){
      let vm=this
      evt.stopPropagation()
      vm.$emit('close',false)
  }
  loadDetail(){
      service.getActivityDetail(this.params).then(res=>{
          this.Info=res[0]
      })
  }
}
</script>
