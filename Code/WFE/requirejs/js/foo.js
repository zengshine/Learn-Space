//b.js
define(["js/bar.js"], function (aModule) {
    function fn6(){
        aModule.fn1()
    }
    return {
        fn6:fn6
    }
  });