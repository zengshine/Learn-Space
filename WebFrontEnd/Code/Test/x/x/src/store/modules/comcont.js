
import API from '../../assets/js/api.js'
let state = {
    OprData: '',
    OprSign: '',
    loginstate: 'init',//init 还未尝试登录， success 登录成功 ， fail: 登录失败
    waitcount: 0, // 待审批条数
    detailobj: {},
    attachment: {}
}

const actions = {
    /**
     * 获取待审批小程序条数
     * @param {*} param0 
     */
    setWaitCount({commit}){
        API.get({
            url: '/api/miniprogram?isGetAuditListCount=true',
            success: data => {
                commit('setWaitCount', data)
            }
        })
    },
    /**
     * 走小程序审批流程
     */
    APIApprove(store,payload){
        return new Promise((resolve, reject) => {
            var formData = new FormData()
            formData.append("MiniProgram", payload.MiniProgram)
            if(payload.CurUser){
                formData.append("CurUser", payload.CurUser);
            }
            if(payload.OpContent){
                formData.append("OpContent", payload.OpContent);
            }
            API.post({
                url: '/api/miniprogram',
                data: formData,
                contentType: false,
                success:data=>{
                    if(resolve){
                        resolve(data);
                    }
                    store.dispatch('setWaitCount');
                },
                fail: (err)=>{
                    if(reject){
                        reject(err)
                    }
                }
            })
        })
    },
    /**
     * 获取小程序详情
     */
    APIGetProDetail(store,id){
        return new Promise((resolve, reject) => {
            API.get({
                url: '/api/miniprogram?id=' + id,
                success:data=>{
                    if(resolve){
                        resolve(data);
                    }
                },
                fail: (err)=>{
                    if(reject){
                        reject(err)
                    }
                }
            })
        })
    },
    /**
     * 获取待填写的小程序
     */
    APIGetWaitProDetail(){
        return new Promise((resolve, reject) => {
            API.get({
                url: '/api/miniprogram?isGetGUNResolvedMPList=true',
                success:data=>{
                    if(resolve){
                        resolve(data);
                    }
                },
                fail: (err)=>{
                    if(reject){
                        reject(err)
                    }
                }
            })
        })
    },
    /**
     * 分页获取所有小程序列表
     */
    APIGetProList(store, payload){
        return new Promise((resolve, reject) => {
            API.post({
                url: '/api/miniprogram?isSearchMPItemByPage=true',
                data: payload,
                success:data=>{
                    if(resolve){
                        resolve(data);
                    }
                },
                fail: (err)=>{
                    if(reject){
                        reject(err)
                    }
                }
            })
        })
    },
    /**
     * 获取总行分行部门名称选项数据 9000
     * 获取调用接口列表 2002
     * 获取配置入口选项 2001
     */
    APIGetParams(store, id){
        return new Promise((resolve, reject) => {
            API.get({
                url: "/api/params?id=" + id,
                success: data => {
                    if(resolve){
                        resolve(data);
                    }
                },
                fail:err=>{
                    if(reject){
                        reject(err)
                    }
                }
            })
        })
    },
    /**
     * 删除小程序
     */
    APIDeletePro(store, id){
        return new Promise((resolve, reject) => {
            API.post({
                url: '/api/miniprogram?isDelMPItem=true&MPID=' + id,
                success: data => {
                    if(resolve){
                        resolve(data);
                    }
                    store.dispatch('setWaitCount');
                },
                fail:err=>{
                    if(reject){
                        reject(err)
                    }
                }
            })
        })
    },
    /**
     * 获取审批记录
     */
    APIGetRecords(store, id){
        return new Promise((resolve, reject) => {
            API.get({
                url: '/api/ApprovalRecord?Type=allRecord&MPID=' + id,
                success: data => {
                    if(resolve){
                        resolve(data);
                    }
                },
                fail:err=>{
                    if(reject){
                        reject(err)
                    }
                }
            })
        })
    },
    /**
     * 下载小程序列表
     */
    APIDownloadProlist(store, payload){
        return new Promise((resolve, reject) => {
            API.post({
                url: '/api/miniprogram?isExportMPItemByFilter=' + payload.isExportMPItemByFilter,
                data: payload.searchform,
                success: data => {
                    if(resolve){
                        resolve(data);
                    }
                },
                fail:err=>{
                    if(reject){
                        reject(err)
                    }
                }
            })
        })
    }

}
const mutations = {
    // 设置是否登录
    setLoginState(state, s){
        state.loginstate = s
    },
    // 设置待审批条数
    setWaitCount(state, num){
        state.waitcount = num
    },
    // 临时detail
    setDetailAttach(state, attach){
        state.attachment = attach;
    },
    setDetailObj(state, detailobj){
        state.detailobj = detailobj;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}