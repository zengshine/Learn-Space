import { API_DEFAULT_CONFIG } from '@/config'

// axios 默认配置
export const AXIOS_DEFAULT_CONFIG = {
    baseURL: API_DEFAULT_CONFIG.baseUrl,
    timeout: 5000,
    maxContentLength: 20000,
    headers: {}
}

export interface AxiosResponse<T = any> {
    data: T;
}

export function requestSuccessFunc(requestConfig: any) {
    // Do something before request is sent
    window.vbus.$emit('global.loading')
    return requestConfig
}
export function requestFailFunc(requestError: any) {
    // Do something with request error
    return Promise.reject(requestError)
}
export function responseSuccessFunc(response: any) {
    //Do something with response data: 全局拦截接口，根据不同业务做不同处理，响应成功监控等
    window.vbus.$emit('global.loaded')
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
    window.vbus.$emit('global.loaded')
    console.log(responseError)
    window.vbus.$emit('global.message',{message:"获取数据失败，请检查网络是否连接"})
    return Promise.reject(responseError)
}

