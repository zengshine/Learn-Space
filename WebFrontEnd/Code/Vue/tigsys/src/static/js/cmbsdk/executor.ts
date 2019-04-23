import { ILocation } from '@/types';

let CMBLS = window.CMBLS?window.CMBLS:{};
CMBLS.gps = {};
CMBLS.gps.successCallback = function(id, message) {
    //gps定位成功
    let location!:ILocation
    location.mchLocLat=message.latitude
    location.mchLocLng=message.longitude
    location.mchAdrPvn=message.address.province
    location.mchAdrCty=message.address.city
    location.mchAdrReg=message.address.subcity
    window.vbus.$emit("global.location",location,"gps")
    window.vbus.$emit("global.message",{message:"获取gps定位成功"})
};
CMBLS.gps.failCallback = function(id, message) {
  //window.vbus.$emit("global.message",{message:"获取位置信息失败，请手动选择城市"})
  let location:ILocation=JSON.parse(localStorage.getItem('locaiton')!)
  window.vbus.$emit("global.location",location,"history")
  window.vbus.$emit("global.message",{message:`获取gps定位成功:${JSON.stringify(message)}`})
};

export function cmblsJSExecutor(cmblsCommand) {
    if (window.cmblsExecutor) {
      var cmblsExecutor = window.cmblsExecutor || {};
      cmblsExecutor.executeCmbls("1.0", cmblsCommand);
    } else {
      document.addEventListener(
        "CMBLSExecutorReady",
        function() {
          var cmblsExecutor = window.cmblsExecutor || {};
          window.cmblsExecutor.executeCmbls("1.0", cmblsCommand);
        },
        false
      );
    }
  }
