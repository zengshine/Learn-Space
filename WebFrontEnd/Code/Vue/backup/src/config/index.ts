// 当前宿主平台
export const HOST_PLATFORM = 'WEB'
// 这个就不多说了
export const NODE_ENV = process.env.NODE_ENV || 'prod'

// 是否强制所有请求访问本地 MOCK，看到这里同学不难猜到，每个请求也可以单独控制是否请求 MOCK
export const AJAX_LOCALLY_ENABLE = false
// 是否开启监控
export const MONITOR_ENABLE = true

// API 默认配置
export const API_DEFAULT_CONFIG = {
    baseUrl: process.env.NODE_ENV !== 'production' ? "" : "",
    mockBaseURL: '',
    mock: true,
    debug: false,
    sep: '/'
}

// CONST 默认配置
export const CONST_DEFAULT_CONFIG = {
    sep: '/'
}

// 还有一些业务相关的配置
// ...


// 还有一些方便开发的配置
export const DEBUG_VUE_DEVTOOLS = true      // 开启请求参数打印
export const DEBUG_VUE_DEBUG = true     // 开启响应参数打印
export const DEBUG_VUE_TIP = true      // 监控记录打印


export const CONSOLE_REQUEST_ENABLE = true      // 开启请求参数打印
export const CONSOLE_RESPONSE_ENABLE = true     // 开启响应参数打印
export const CONSOLE_MONITOR_ENABLE = true      // 监控记录打印