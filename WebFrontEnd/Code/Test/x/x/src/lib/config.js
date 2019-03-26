export default {
    install(Vue) {
        let obj = {
            p_mypro: '/index', // 我的小程序页面
            p_mypro1: '/',  // 我的小程序页面
            p_promanger: '/promanager',  // 小程序管理页面
            p_prodetail: '/prodetail',  // 小程序详情
            p_waitapp: '/waitapproval', //待审页面
            p_assistapp: '/assistapproval', // 协助审批页面
            p_test: '/testmerchant'
        }
        Vue.prototype.MENU = {
            m_mypro: {key:'p_mypro', topath: obj.p_mypro, repath: obj.p_mypro1, name:'我的小程序', icon: 'icon-mypro', roles:[0,1,2]},
            m_promanger: {key:'p_promanger',  topath: obj.p_promanger,  name:'小程序管理', icon: 'icon-manager', roles:[1]},
            m_waitapp: {key: 'p_waitapp', topath: obj.p_waitapp,  name:'待审批', icon: '', roles:[1]},
            m_assistapp: {key:'p_assistapp', topath: obj.p_assistapp,  name:'协助审核', icon: 'icon-approval1', roles:[2]}
        }
       Vue.prototype.StateConf = {
           11: '立项申请中',
           12: '立项通过',
           13: '立项不通过',
           21: '商户号申请中',
           22: '测试商户号处理中',
           23: '商户号被拒绝',
           24: '商户号已颁发',
           31: '方案审核中',
           32: '方案通过',
           33: '方案不通过',
           41: '测试申请中',
           42: '测试通过',
           43: '测试不通过',
           51: '上线申请中',
           52: '已上线',
           53: '上线被拒绝'
       }
       Vue.prototype.ShowDetailList = {}
       Vue.prototype.pathObj = obj;
       Vue.prototype.BASEURL = 'http://localhost:8085'
    }
}  