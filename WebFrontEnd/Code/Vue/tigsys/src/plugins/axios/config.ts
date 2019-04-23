import { API_DEFAULT_CONFIG } from '@/config'

// axios 默认配置
export const AXIOS_DEFAULT_CONFIG = {
    baseURL: API_DEFAULT_CONFIG.baseUrl,
    timeout: 20000,
    maxContentLength: 2000,
    headers: {}
}

export interface AxiosResponse<T = any> {
    data: T;
}

export function requestSuccessFunc(requestConfig: any) {
    // Do something before request is sent
    return requestConfig
}
export function requestFailFunc(requestError: any) {
    // Do something with request error
    return Promise.reject(requestError)
}
export function responseSuccessFunc(response: any) {
    //Do something with response data: 全局拦截接口，根据不同业务做不同处理，响应成功监控等
    let data=response.data
    let { RTNCOD } = data
    switch (RTNCOD) {
        case "SUC0000": 
        let {INFBDY:{outputParams}}=data
        return outputParams
        case "ERRMSG":
        let {ERRMSG}=data
        window.vbus.$emit('global.message',{message:ERRMSG})
        return Promise.reject(ERRMSG)
        default: break;
    }
}
export function responseFailFunc(responseError: any) {
    //Do something with response error
    console.log(responseError)
    return Promise.reject(responseError)
}

