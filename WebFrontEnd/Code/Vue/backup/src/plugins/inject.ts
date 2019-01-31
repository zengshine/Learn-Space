
import axios from './axios'

export default {
    install:(Vue:any,options:any)=>{
        Vue.prototype.$ajax=axios
    },
}