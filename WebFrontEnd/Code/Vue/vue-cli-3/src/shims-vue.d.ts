//Tip:如果要识别第三方插件可以在此添加申明
import Vue from 'vue'
declare module 'vue/types/vue' {
  //Declare augmentation for Vue
  interface Vue {
    $ajax:any,
    $wx: any, //自定义微信接口
  }
  // Global properties can be declared
  // on the `VueConstructor` interface
  interface VueConstructor {
    trait:any
  }
}
