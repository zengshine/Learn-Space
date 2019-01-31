<template>
  <div>
    <canvas id="canvas"></canvas>
    <div id="halo">
      <div></div>
    </div>
    <div id="foreground">
      <div class="hidden" id="tree1"></div>
      <div id="reed1" class="reed"></div>
      <div id="reed2" class="reed"></div>
      <div id="reed3" class="reed"></div>
      <div class="hidden" id="tree2"></div>
      <div id="bush"></div>
      <div id="girl">
        <svg x="0px" y="0px" width="108px" height="136px">
          <path
            id="ponytail"
            d="M48.562,31.343c-0.518-1.412-0.861-2.857-1.071-4.349c-0.1-0.708-0.037-1.378,0.177-2.024
                             c0.64-1.938,1.749-3.574,3.319-4.886c0.499-0.416,1.035-0.635,1.725-0.414c0.563,0.18,1.171,0.228,1.896,0.358
                             c-0.166,0.426-0.225,0.804-0.431,1.066c-0.458,0.589-1.168,0.999-1.493,1.672c-0.608,1.26,0.575,5.528,0.575,5.528l3.873-13.77
                             c-0.494,0.541-1.042,0.765-1.817,0.72c-1.05-0.06-2.152-0.069-3.16,0.184c-1.187,0.298-2.314,0.278-3.511,0.201
                             c-1.36-0.089-2.744,0.072-4.016,0.933c0.063,0.926-0.333,1.621-1.198,2.071c-0.38,0.198-0.728,0.498-1.019,0.819
                             c-0.626,0.688-1.362,1.343-1.776,2.152c-0.971,1.895-1.559,3.942-1.951,6.04c-0.046,0.244-0.103,0.515-0.042,0.743
                             c0.337,1.241,0.046,2.475,0.005,3.711c-0.071,2.129-0.02,4.237,0.76,6.275c0.263,0.688,0.4,1.458,0.429,2.197
                             c0.083,2.119,0.19,4.251-0.811,6.24c-0.25,0.499-0.386,1.055-0.57,1.586c-0.583,1.687-0.677,3.423-0.488,5.18
                             c0.037,0.338,0.229,0.659,0.366,1.032c0.609-0.45,0.716-0.981,0.687-1.556c-0.021-0.438-0.104-0.872-0.1-1.307
                             c0.01-1.102,0.009-2.211,0.716-3.334c0.396,1.104,0.22,2.258,1.167,3.211c-0.077-0.791-0.164-1.392-0.186-1.995
                             c-0.017-0.485,0.425-0.801,0.9-0.646c0.283,0.094,0.604,0.232,0.785,0.452c0.475,0.576,0.637,2.44,0.683,1.818
                             c0.415-5.59,6.55-12.537,6.595-17.124C49.592,33.14,48.902,32.271,48.562,31.343z"
          ></path>
          <animateTransform
            xlink:href="#ponytail"
            attributeName="transform"
            attributeType="XML"
            type="skewX"
            values="0; 4; 0;"
            keyTimes="0; .5; 1"
            keySplines=".42 0 1 1;
                                    0 0 .59 1;"
            dur="4s"
            begin="0s"
            fill="freeze"
            repeatCount="indefinite"
          ></animateTransform>
        </svg>
      </div>
      <div id="telescope"></div>
      <div id="grass"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import snowShower from "@/utils/SnowShower";
@Component
export default class SnowShower extends Vue {
  @Prop() private msg!: string;
  mounted() {
    let vm = this;
    let Shower = new snowShower();
    Shower.start();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" src="@/static/scss/SnowShower/snowShower.scss" scoped>
</style>

