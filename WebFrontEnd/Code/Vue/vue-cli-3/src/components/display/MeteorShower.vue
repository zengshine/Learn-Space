<template>
  <div>
    <canvas id="bgCanvas"></canvas>
    <canvas id="terCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { MeteorShower } from "@/utils/MeteorShower";
@Component
export default class SnowShower extends Vue {
  @Prop() private msg!: string;
  mounted() {
    let vm = this;
    let MSInstance = new MeteorShower("bgCanvas", "terCanvas", 5);
    MSInstance.clearBg();
    MSInstance.start();
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

