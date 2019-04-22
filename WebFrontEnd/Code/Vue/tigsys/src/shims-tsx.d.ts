import Vue, { VNode } from "vue";
declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
  interface Window {
    $: Function
    vbus:any
    limit: Function;
    urlQuery: Function
    mozRequestAnimationFrame: Function;
    msRequestAnimationFrame: Function;
    bodymovin: any
    lottie: any
    AMap:any
    CMBLS:any
    cmblsExecutor:any
  }
}
