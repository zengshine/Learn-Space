import axios from "@/plugins/axios";
function getMercList(inputParams) {
    let params={
        "PRCCOD":"APPQUERYMCHLIST",
        "INFBDY":{
            "inputParams":[
                {
                    "mchAdrPvn":"山东省",
                    "mchAdrCty":"烟台市",
                    "mchAdrReg":"海阳市",
                    "mchLocLng":120.173082,
                    "mchLocLat":30.186205,
                    "showInApp":"1",
                    "mchAdrBd":"宝龙城",
                    "mchTag":"炸鸡",
                    "befTyp":"01",
                    "schKeyword":""
                }
            ]
        }
    }
    params.INFBDY.inputParams[0]=inputParams
    return axios({
        url:"/metapi/rmi.do",
        method: "Post",
        data: params,
      })
  }
  function getMercItem(inputParams) {
    let params={
        "PRCCOD":"APPQUERYMCHINF",
        "INFBDY":{
            "inputParams":[{
                "mchId":"MCH0001"
            }]
        }
    }    
    params.INFBDY.inputParams[0]=inputParams
    return axios({
        url:"/metapi/rmi.do",
        method: "Post",
        data: params,
      })
  }
  function getActivityDetail(inputParams){
      let params={
        "PRCCOD":"APPQUERYBEFDTL",
        "INFBDY":{
            "inputParams":[
                {
                    "mchId":"MCH1115620857822187520",
                    "befBeanId":"BEF1117688192255004672",
                    "befTyp":"FLJ"
                }
            ]
        }
    }
    params.INFBDY.inputParams=inputParams
    return axios({
        url:"/metapi/rmi.do",
        method: "Post",
        data: params,
    })    
  }
  function getCityJson(){
    return axios({
        url:"/json/city.json",
        method: "Get",
    })   
  }
export default {
    getMercList,
    getMercItem,
    getActivityDetail,
    getCityJson
};
