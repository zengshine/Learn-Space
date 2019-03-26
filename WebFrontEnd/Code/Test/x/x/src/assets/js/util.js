
import { Message } from 'element-ui';
import { MessageBox } from 'element-ui'

var Reg = {
  email: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
  num: /(?=(?!\b)(\d{3})+$)/,
  basepath: /^((\/)|(\/[0-9.\-A-Za-z_]+)*)$/,
  path: /^(\/(({[0-9.\-A-Za-z_]+})|([0-9.\-A-Za-z_]+)))*\/?$/, // 带大括号的path
  url: /^http(s)?:(\/{2})(([0-9\-A-Za-z_]+\.)+[0-9\-A-Za-z_]+)(?::(\d+))?.*$/, // 通用url
  cn_char: /[^u4e00-u9fa5]/,
  host: /^(([0-9\-A-Za-z_]+\.)+[0-9\-A-Za-z_]+)(?::(\d+))?$/,
  ipv4: /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/
}
var Identity = null;

const Util = {
    /**
   * 展示信息（默认错误信息）
   * @param {String} str 
   * @param {String} type 
   */
  showMsg: function (str, type) {
    Message({
      type: type || 'error',
      message: str,
      showClose: true
    })
  },
  /**
   * 消息确认
   * @param {Sting} msg 提示文字
   * @param {Function} cb 回调函数
   */
  showConfirm: function (msg, cb) {
    MessageBox.alert(msg, "提示", {
        confirmButtonText: '确定',
    })
      .then(function(){
          if(cb){
              cb()
          }
      })
  },
  /**
   * 由于参数复杂，使用route.query 获取对象的时候，获得的参数中 %2F等会被decodeURIComponent成 /
   * @param {Object} q 经过解码后的query 对象
   */
  getQueryObj(q){
    let temp = {};
    for(let key in q){
        let str = q[key];
        str = encodeURIComponent(str) // 先还原解码
        str = decodeURI(str) // 用把他当uri 的方式解码
        temp[key] = str;
    }
    return temp;
      //route.query获取较为复杂的url参数时,如含有%2F会转义处理成/     此时用回老办法
    //   var queryObj={}
    //   var str=path.split("?")[1],
    //     items=str.split("&");
    //   var arr,name,value;
    //   for(var i = 0;i< items.length; i++){
    //     arr=items[i].split("=");
    //     name= arr[0];
    //     value= arr[1];
    //     queryObj[name]=value;
    //   }
  },
  /**
   * 获取字符串的长度（中文字符占两位）
   * @param {String} str 
   */
  getStrLen(str){
    let reg = new RegExp(Reg.cn_char, 'g');
    str = str.replace(reg, '00');
    return str.length;
  },
  /**
   * 
   * @param {Sting} utctime utc时间或 本地实际
   * @return {String} 本地时间
   */
  getLocalFromUTC: function(utctime){
    let d = new Date(utctime);
    return this.formatDate(d, 'yyyy-MM-dd HH:mm:ss')
  },
  /**
   * 格式化日期
   * @param {Date} date 日期对象
   * @param {String} str 日期格式 如 yyyy-MM-dd HH:mm:ss
   * @return {String} 格式化之后的日期字符串
   */
  formatDate: function (date, str) {
    if (!date) {
      return ''
    }
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    if (isNaN(year) || isNaN(month)) {
      return ''
    }
    var fstr = str
    if (/yyyy/.test(fstr)) {
      fstr = fstr.replace(/yyyy/, year)
    } else if (/yy/.test(fstr)) {
      var yy = (year + '').replace(/\d{2}/, '')
      fstr = fstr.replace(/yy/, yy)
    }
    var setFstr = function (full, some, value) {
      if (full.test(fstr)) {
        if (value < 10) {
          fstr = fstr.replace(full, '0' + value)
        } else {
          fstr = fstr.replace(full, value)
        }
      } else if (some.test(fstr)) {
        fstr = fstr.replace(some, value)
      }
    }
    setFstr(/MM/, /M/, month); // MM 月份补 0 ， M 月份 不 补0
    setFstr(/dd/, /d/, day); // dd 日补 0 ， d 日  不 补0
    setFstr(/HH/, /H/, hour); // HH 小时 24小时制；H 小时 24小时制 不补0
    setFstr(/mm/, /m/, minute); // mm 分钟 补0， m 分钟 不补0
    setFstr(/ss/, /s/, second); // ss 秒 补0， s 秒 不补0

    return fstr
  },
  /**
   * 删除确认
   * @param {Sting} msg 提示文字
   * @param {Function} cb 回调函数
   */
  showDeleteConfirm: function (msg, cb) {
    MessageBox.confirm("<div class='delete-message'>此操作将<span class='forever'>永久</span>删除该" + msg + ", 是否继续?</div>", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      customClass: 'delete-confirm',
      dangerouslyUseHTMLString: 'true',
      cancelButtonClass: 'cancel-btn',
      confirmButtonClass: 'confirm-btn',
      type: "warning"
    })
      .then(cb)
      .catch(function () {
        Message({
          type: "info",
          message: "已取消删除",
          showClose: true
        });
      });
  },
  /**
   * 处理错误消息
   */
  handleError(error){
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      let data = error.response.data;
      let status = error.response.status;
      if(status == 401){
        Identity.showLoginFail();    
      }else{
        Util.showMsg(data.Message[0])
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      // console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      // console.log('Error', error.message);
      Util.showMsg(error.Message);
    }
  }
}
import store from '../../store/index.js'
Identity = {
  getIdCurUser(){
    let str = localStorage.getItem('CurUser');
    let cur = null;
    try{
      cur = JSON.parse(str)
    }catch(e){
      cur = null;
    }
    if(cur){
      return cur;
    }else{
      this.showLoginFail();
      return null;
    }
  },
  getIdUserStr(){
    let str = localStorage.getItem('CurUser');
    if(!str){
      this.showLoginFail();
      return '';
    }
    return str
  },
  getTicket(){
    let CurUser = this.getIdCurUser();
    if(CurUser && CurUser.TICKET){
      return CurUser.TICKET
    }else{
      this.showLoginFail();
      return ''
    }
  },
  deleteTicket(){
    store.commit('identity/deleteTicket');
    let str = localStorage.getItem('CurUser');
    let obj = null;
    try{
      obj = JSON.parse(str)
    }catch(e){
      obj = null;
    }
    if(obj){
      obj.TICKET = ''
      let temp = JSON.stringify(obj);
      localStorage.setItem('CurUser',temp);
    }
  },
  showUnknow(){
    this.deleteTicket();
    store.commit('comcont/setLoginState', 'fail')
    Util.showConfirm('用户未授权或授权超时，请尝试刷新或返回互联网运营平台入口重新访问')
  },
  showLoginFail(){
    this.deleteTicket();
    store.commit('comcont/setLoginState', 'fail')
  },
  /**
     * 是否已经登录,判断该路由所带的身份信息是否已登录(如果传入的携带信息等于记录的信息或者未传入携带信息则判断为已登录)
     * @param {*} queryObj 传入的路由信息
     */
    isLogin(queryObj){
      let OprData = queryObj.OprData
      let OprSign = queryObj.OprSign
      let RoleType = queryObj.RoleType;
      let cur = this.getIdCurUser();
      if(cur && cur.TICKET && cur.OprData && cur.OprSign && /^(0|1|2|3)$/.test(cur.ROLETYPE + '')){
        // 记录信息都存在
          if(!OprData && !OprSign && !/^(0|1|2|3)$/.test(RoleType + '')){
              // 传入信息同时不存在
              return true;
          }else if(RoleType == cur.ROLETYPE && OprData == cur.OprData && OprSign == cur.OprSign){
              // 传入信息中 所有信息同时等于记录信息
              return true;
          }else{
              // 传入信息存在，并且某个或全部不等于记录信息
              return false;
          }
      }else{
          // 记录信息不存在（ticket 不存在 或者身份信息不存在）
          return false;
      }
  },
  /**
     * 获取去登录的验证信息（此时传入的携带信息不等于记录的信息或者记录信息不存在）,需要路由携带信息齐全或者记录信息齐全，否则返回null
     */
    getVarifyMsg(queryObj){
      let OprData = queryObj.OprData
      let OprSign = queryObj.OprSign
      let RoleType = queryObj.RoleType;
      
      if(OprData && OprSign && /^(0|1|2|3)$/.test(RoleType + '')){
          // 如果携带全部信息(某个或全部与记录信息不等)
          return queryObj;
      }else if(!OprData && !OprSign && !/^(0|1|2|3)$/.test(RoleType + '')){
          // 传入信息同时不存在并且(记录信息中的除ticket外同时存在)
          let cur = this.getIdCurUser();
          if(cur && cur.OprData && cur.OprSign && /^(0|1|2|3)$/.test(cur.ROLETYPE + '')){
              return {
                  OprData: cur.OprData,
                  OprSign: cur.OprSign,
                  RoleType: cur.ROLETYPE
              }
          }
      }
      return null;
  }
}
/**
 * 
 * @param {Array} arr 如果上一级为这些路径，则跳到上一级
 * @param {String} replaceurl 否则到这个路径
 * @param {Object} replacequery 
 */
const getLastUrlMsg = function(arr, replaceurl, replacequery) {
  let lasthref = localStorage.getItem('lasthref');
  let lastquery = localStorage.getItem('lastquery');
  let query = null;
  try{
      query = JSON.parse(lastquery)
  }catch(e){
    query = {}
  }
  let temp = {};
  for(let i = 0, len = arr.length; i < len; i++){
    if(lasthref == arr[i]){
      temp.path = lasthref;
      temp.query = query;
      break;
    }
  }
  if(!temp.path){
    temp = {
      path: replaceurl,
      query: replacequery
    }
  }
  return temp;
}
export default {
    Util,
    Reg,
    Identity,
    getLastUrlMsg
}