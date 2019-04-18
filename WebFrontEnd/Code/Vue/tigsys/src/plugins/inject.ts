
import axios from './axios/index'

export default {
    install:(Vue:any,options:any)=>{
        Vue.prototype.$ajax=axios
    },
}