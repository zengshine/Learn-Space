declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module 'swiper'

declare interface Window {
  $: Function
  limit: Function;
  urlQuery: Function
  mozRequestAnimationFrame: Function;
  msRequestAnimationFrame: Function;
  bodymovin: any
}
