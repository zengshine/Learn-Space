import axios from 'axios';
const BASEURL = 'http://localhost:8085'
const Identity = {
    getIdCurUser(){
        let str = localStorage.getItem('CurUser');
        let cur = null;
        try{
          cur = JSON.parse(str)
        }catch(e){
          cur = null;
        }
        return cur;
      },
    getTicket(){
        let CurUser = this.getIdCurUser();
        if(CurUser && CurUser.TICKET){
          return CurUser.TICKET
        }else{
          return ''
        }
      }
}
export default {
    handleSuccess(res, opts){
        let data = res.data;
        if(data.StateCode){
            if(opts.success){
                opts.success(data.Data);
            }
        }else{
            if(opts.fail){
                opts.fail(data.Message);
            }
        }
    },
    get(opts){
        let self = this;
        let headers = opts.headers || {}
        if(!opts.noticket){
          let ticket = Identity.getTicket();
          if(!ticket){
            return;
          }
          headers['Authorization'] = 'BasicAuth ' + ticket;
        }
        axios.get(BASEURL + opts.url, {headers, withCredentials: true}).then(function (res) {
            self.handleSuccess(res, opts)
        }).catch(function (error) {
            if(opts.fail){
                opts.fail(error);
            }
        });
    },
    post: function (opts) {
      let self = this;
        let headers = opts.headers || {}
        if(!opts.noticket){
          let ticket = Identity.getTicket();
          if(!ticket){
            return;
          }
          headers['Authorization'] = 'BasicAuth ' + ticket;
        }
        let ct = opts.contentType == undefined ? 'application/json' : opts.contentType
        headers['Content-Type'] = ct;
        axios.post(BASEURL + opts.url, opts.data, {
          headers:headers,
          responseType: opts.dataType || 'json',
          withCredentials: true
        }).then(function (res) {
            self.handleSuccess(res, opts)
        }).catch(function (error) {
            if(opts.fail){
                opts.fail(error);
            }
        });
      }
}
