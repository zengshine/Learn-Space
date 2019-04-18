window.CMBLS = window.CMBLS?window.CMBLS:{};
CMBLS.gps = {};
CMBLS.gps.successCallback = function(id, message) {
    window.vbus.$emit("global.location.gps",location,"gps")
};
CMBLS.gps.failCallback = function(id, message) {
  //window.vbus.$emit("global.message",{message:"获取位置信息失败，请手动选择城市"})
  window.vbus.$emit("global.location.history",JSON.parse(localStorage.getItem('locaiton')))
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
