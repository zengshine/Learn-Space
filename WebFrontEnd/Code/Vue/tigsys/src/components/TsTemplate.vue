<template></template>

<script lang="ts">
import { Component, Vue, Prop,Model } from "vue-property-decorator";
@Component({
  components: {
  }
})
export default class Detial extends Vue {
  @Prop({default:false}) isShow!: boolean;
  @Model('change',{type:Boolean}) visible!:boolean;
  private tickes=[];
  data() {
    return {
    };
  }
  created() {
  }
  mounted() {}
}
</script>
