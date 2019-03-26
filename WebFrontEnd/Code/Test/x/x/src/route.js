
const myprogram = () => import('./pages/myprogram.vue')
const prodetail = () => import('./pages/programdetail.vue')
const promanage = () => import('./pages/promanage.vue')
const waitapproval = () => import('./pages/waitapproval.vue')
const testmerchant = () => import('./pages/testmerchant.vue')
const assistapproval = () => import('./pages/assistapproval.vue')

let obj = {
    p_mypro: '/index', // 我的小程序页面
    p_mypro1: '/',  // 我的小程序页面
    p_promanger: '/promanager',  // 小程序管理页面
    p_prodetail: '/prodetail',  // 小程序详情
    p_waitapp: '/waitapproval', //待审页面
    p_assistapp: '/assistapproval', // 协助审批页面
    p_test: '/testmerchant'
}
const routes = [
    { path: obj.p_mypro1, component: myprogram },
    { path: obj.p_mypro, component: myprogram },
    { path: obj.p_prodetail, component: prodetail },
    { path: obj.p_promanger, component: promanage },
    { path: obj.p_waitapp, component: waitapproval },
    { path: obj.p_assistapp, component: assistapproval },
    { path: obj.p_test, component: testmerchant }
]
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);
var router = new VueRouter({
    routes: routes
})

export default router;