import Vue from "vue";
import App from "./App.vue";
import inject from "./plugins/inject";
import router from "./plugins/router";
import store from "./store/store";
import "./registerServiceWorker";

import "../src/utils/BodyMoving/index.js"
import "../src/utils/Flexible/flexible-self-v2.js"
import "../src/utils/Pollyfill/basic.js"
import "../src/utils/index.ts"

import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import "../node_modules/animate.css/animate.min.css"
import "../node_modules/swiper/dist/css/swiper.min.css"

Vue.config.productionTip = false;

Vue.use(inject)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
