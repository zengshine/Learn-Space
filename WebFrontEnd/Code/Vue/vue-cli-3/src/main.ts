import Vue from "vue";
import App from "./App.vue";
import inject from "./plugins/inject";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

import "../src/static/js/flexible.js"
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css"

Vue.config.productionTip = false;

Vue.use(inject)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
