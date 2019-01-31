<template>
  <div>
    <transition v-for="(item,index) in data" :key="index" :enter-active-class="item.animatedClass">
      <div :class="[item.cssClass]" v-if="item.isVisible" v-html="item.text"></div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TransitionText extends Vue {
  @Prop() private data!: any;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
