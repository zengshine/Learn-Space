export default function routerBeforeEach(to:any,from:any,next:any){
    //可以在这里做页面拦截，及权限管理
    //处理逻辑
    next()
}