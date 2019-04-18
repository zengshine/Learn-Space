const mercList = require("../mock/merList.json");
export default {
  proxy: {
    "/maps": {
      target: "https://maps.googleapis.com",
      //target:"http://163.53.88.122:60002",
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        "^/maps": "/maps"
      }
    },
    "/api": {
      target: "http://[::1]:8084",
      //target:"http://163.53.88.122:60002",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/api"
      },
      secure: false
    }
  },
  before(app){
    app.get('http://metapi.paas.cmbchina.cn/metapi/rmi.do',(req,res,next)=>{
      res.json(mercList);
    })
  }
};