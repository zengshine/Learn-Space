import Vue from 'vue'
import App from './App.vue'
import router from './route.js'
import store from './store/index.js'
import './plugins/element.js'


import './assets/css/reset.css'
import './assets/css/components.css'
import './assets/font/iconfont.css'
Vue.config.productionTip = false
import config from './lib/config.js'
import util from './assets/js/util.js'
const Identity = util.Identity;
const Util = util.Util;
Vue.use(config)
/**
 * 成功登陆，或者判断为一登录要做的事情
 * @param {Object} queryobj 路由上带的身份信息 
 * @param {String} path // 要去的路径
 * @param {Function} next 
 */
let doNext = function(queryobj, path, next){
  let CurUser = Identity.getIdCurUser();
  store.commit('comcont/setLoginState', 'success')
  store.commit('identity/setIndentity',CurUser)
  let temp = {...queryobj};
  if(temp.OprData || temp.OprSign){
    delete temp.OprData;
    delete temp.OprSign;
    delete temp.RoleType;
    let saveobj = {path:path, query: temp};
    next(saveobj);
  }else{
    next()
  }
}
router.beforeEach((to, from, next) => {
    localStorage.setItem('lasthref', from.path);
    localStorage.setItem('lastquery', JSON.stringify(from.query || {}));
    let queryobj = Util.getQueryObj(to.query);
    if(!Identity.isLogin(queryobj)){
      let usermsg = Identity.getVarifyMsg(queryobj);
      if(usermsg){
        store.dispatch('identity/login', usermsg).then((user) => {
          localStorage.setItem('CurUser',JSON.stringify(user))
          doNext(queryobj, to.path, next);
        }).catch(()=>{
          Identity.showUnknow();
          next()
        })
      }else{
        Identity.showLoginFail();
        next()
      }
    }else{
      doNext(queryobj, to.path, next);
    }
})
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
