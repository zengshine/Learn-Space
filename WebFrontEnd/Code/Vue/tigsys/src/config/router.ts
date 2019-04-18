// 路由默认配置，路由表并不从此注入
export const ROUTER_DEFAULT_CONFIG = {

}
//路由钩子函数
export default function routerBeforeEach(to: any, from: any, next: any) {
    //可以在这里做页面拦截，及权限管理
    //处理逻辑
    next()
}