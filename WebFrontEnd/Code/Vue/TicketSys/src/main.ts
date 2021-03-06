import Vue from "vue";
import App from "./App.vue";
import inject from "./plugins/inject";
import router from "./plugins/routes";
import store from "@/plugins/store";
import "./registerServiceWorker";
import Mint from 'mint-ui';

import "../src/utils/Pollyfill/basic.js"
import "../src/utils/index.ts"
import "@/static/js/mintui/index.js"
import "@/static/js/IconSymbol/icon.js"
import "@/directives/directive.js"
import {cmblsJSExecutor} from "@/static/js/cmbsdk/executor.ts"

import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import "../node_modules/animate.css/animate.min.css"
import 'mint-ui/lib/style.css';


Vue.config.productionTip = false;
window.CMBLS = window.CMBLS?window.CMBLS:{}
//隐藏招商银行app topbar
cmblsJSExecutor("http://cmbls/TopBarUI?id=16&hide=true")

Vue.use(inject)
Vue.use(Mint);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
