<template>
  <div>
    <canvas :id="bgId"></canvas>
    <canvas :id="terId"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { MeteorShower } from "@/utils/MeteorShower";
@Component
export default class SnowShower extends Vue {
  @Prop() private isPlaying!: boolean;
  @Prop({ default: true }) private isShowMeteor!: boolean;
  private key: any;
  private bgId!: string;
  private terId!: string;
  private MSInstance: any;
  data() {
    return {
      key: Math.random()
    };
  }
  created() {
    let vm = this;
    vm.bgId = `bgCanvas${vm.key}`;
    vm.terId = `terCanvas${vm.key}`;
  }
  mounted() {
    let vm = this;
    vm.$nextTick(() => {
      vm.MSInstance = new MeteorShower(vm.bgId, vm.terId, 5);
      vm.MSInstance.clearBg();
      vm.MSInstance.setMeteor(vm.isShowMeteor);
    });
  }
  @Watch("isPlaying")
  onisPlayingChange(newV: boolean) {
    let vm = this;
    if (newV) {
      vm.MSInstance.start();
    } else {
      vm.MSInstance.stop();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

