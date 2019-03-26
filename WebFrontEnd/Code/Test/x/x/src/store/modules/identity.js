
import API from '../../assets/js/api.js'
let state = {
    ROLETYPE: 0, // 登录角色
    TICKET: '',// 身份信息
}
let getters = {
    // identity: state => {
    //   return state.ROLETYPE + '__' + state.OprData + '__' + state.OprSign
    // }
  }
const actions = {
    /**
     * 地址上带了路由信息的登录
     */
    login(store,payload){
        return new Promise((resolve, reject) => {
            var formData = new FormData();
            formData.append("data", payload.OprData.replace(/\s/g, ""));
            formData.append("token", payload.OprSign.replace(/\s/g, ""));
            formData.append("isTokenExpired", true); //测试时提交
            formData.append("RoleType", payload.RoleType) //测试时设置用户角色
            API.post({
                url: '/api/users',
                noticket: true,
                data: formData,
                contentType: false,
                success: (data)=>{
                    let cur = {...data, OprData:payload.OprData, OprSign:payload.OprSign};
                    resolve(cur);
                },
                fail:()=>{
                    reject();
                }
            })
        })
    }
}
const mutations = {
    // 设置登录角色
    setIndentity(state, user){
        user = user || {}
        state.ROLETYPE = user.ROLETYPE || 0;
        state.TICKET = user.TICKET || '';
    },
    deleteTicket(){
        state.TICKET = '';
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}