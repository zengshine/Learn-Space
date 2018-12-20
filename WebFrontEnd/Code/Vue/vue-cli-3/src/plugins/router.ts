import Vue from 'vue'
import Router from 'vue-router'
import Routes from '../routes'
import { RouterOptions, RouteConfig } from 'vue-router';
import {ROUTER_DEFAULT_CONFIG} from '../config/index'
import routerBeforeEachFunc from '../config/interceptors/router'

Vue.use(Router)

//注入默认配置和路由表
let routerInstance = new Router({
    routes:Routes
})

//注入拦截器
routerInstance.beforeEach(routerBeforeEachFunc)

export default routerInstance