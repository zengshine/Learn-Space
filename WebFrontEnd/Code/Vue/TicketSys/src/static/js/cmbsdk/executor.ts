import { ILocation } from '@/types';
let isInit=false
function init(){
  if(isInit) return
  isInit=true
  window.CMBLS.gps = {};
  window.CMBLS.gps.successCallback = function(id, message) {
    //定位成功回调
    try{
     function getXmlNodeValue(doc,nodeName){
       //解析xml格式字符串
      return doc.getElementsByTagName(nodeName)[0].childNodes[0].nodeValue
    }
     alert(message)
     var doc = (new DOMParser()).parseFromString(message,"text/xml")
     alert("parse success")
     let location:ILocation={
      mchAdrPvn: "",
      mchAdrCty: "深圳市",
      mchAdrReg: "",
      mchLocLng: 0,
      mchLocLat: 0,
    } 
     location.mchLocLat=getXmlNodeValue(doc,"latitude")
     location.mchLocLng=getXmlNodeValue(doc,"longitude")
     location.mchAdrPvn=getXmlNodeValue(doc,"province")
     location.mchAdrCty=getXmlNodeValue(doc,"city")
     location.mchAdrReg=getXmlNodeValue(doc,"subcity")
     alert("suc:"+JSON.stringify(location))
     window.vbus.$emit("global.location",location,"gps") 
    }catch(ex){
      alert("error")
    }  
 };
 window.CMBLS.gps.failCallback = function(id, message) {
   //失败回调
   window.vbus.$emit("global.message",{message:`获取gps定位失败:${(message)}`})
   let location:ILocation=JSON.parse(localStorage.getItem('locaiton')!)
   window.vbus.$emit("global.location",location,"history")
   window.vbus.$emit("global.message",{message:`获取gps定位失败:${(message)}`})
 };
}

export function cmblsJSExecutor(cmblsCommand) {
    if (window.cmblsExecutor) {
      init()
      alert(cmblsCommand)
      var cmblsExecutor = window.cmblsExecutor || {};
      cmblsExecutor.executeCmbls("1.0", cmblsCommand);
    } else {
      document.addEventListener(
        "CMBLSExecutorReady",
        function() {
          init()
          var cmblsExecutor = window.cmblsExecutor || {};
          window.cmblsExecutor.executeCmbls("1.0", cmblsCommand);
        },
        false
      );
    }
  }
