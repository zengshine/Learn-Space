<template>
<div class="relative w-h-full">
    <div class="p-30 relative z-2" @click="goBack">
        <span class="goBack-btn">
             <svg class="c-header-arrow svgIcon"><use xlink:href="#iconfanhui1"/></svg>
        </span>
    </div>
    <div id="mapCt" class="map-ct"></div>  
</div>
</template>
<style lang="scss" scoped>
.goBack-btn{
    display: inline-block;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    font-size: 40px;
    background: #fff;
    border-radius: 50%;
}
.map-ct{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
<style>
.amap-logo,.amap-copyright{
    display: none !important;
}
</style>
<script lang="ts">
import { Component, Vue, Prop,Model } from "vue-property-decorator";
import { State } from "vuex-class";
@Component({
  components: {
  }
})
export default class Detial extends Vue {
  @Prop({default:false}) isShow!: boolean;
  @Model('change',{type:Boolean}) visible!:boolean;
  @State("selectedMerc") selectedMerc
  private map:any;
  data() {
    return {
    };
  }
  created() {
  }
  activated () {
    this.setLocation()
  }
  mounted() {
    this.setLocation()
  }
  setLocation(){
    console.log("mapnav:setLocation")
        let position=[this.selectedMerc.mchLocLng,this.selectedMerc.mchLocLat]
        this.map = new window.AMap.Map("mapCt", {
          resizeEnable: true,
          center: position,
          zoom:16
      });
    var marker = new window.AMap.Marker({
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
        position: position,
      });
    marker.setMap(this.map);
  }
  goBack(){
      this.$router.go(-1)
  }
}
</script>
