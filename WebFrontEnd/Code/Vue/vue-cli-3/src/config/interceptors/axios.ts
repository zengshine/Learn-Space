import axiosInstance from '@/plugins/axios';

export interface AxiosResponse<T = any> {
    data: T;
  }
export function requestSuccessFunc(requestObj:any){
    true&&console.info('requestInterceptorFunc',`url:${requestObj.url}`,requestObj)
    return requestObj
}
export function requestFailFunc(requestError:any){
    //自定义发送请求失败逻辑
    return Promise.reject(requestError)
}
export function responseSuccessFunc(responseSuccess:any){
    //自定义响应成功逻辑，全局拦截接口，根据不同业务做不同处理，响应成功监控等
    console.log("success")
    return responseSuccess
}
export function responseFailFunc(responseError:any){
    //响应失败，自定义响应失败处理逻辑
    return Promise.reject(responseError)
}
