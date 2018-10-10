// let exportInstance=new export()

// exportInstance.init()


// // selfModule.js
// define(["jQuery"], function ($) {
//   function export () {}
//   $.extend(export.prototype, {
//       init: function () {
//         //logic
//       }
//     })
//   return new export()
// });

// // main.js
// let expObj = require('selfModule.js')
// expObj.init()

//a.js
define([], function () {
  function fn1(){
    fn4()
    fn5()
    console.log("fn1")
  }
  function fn2(){
    console.log("fn2")
  }
  function fn3(){
    console.log("fn3")
  }
  function fn4(){
    console.log("fn4")
  }
  function fn5(){
    console.log("fn5")
  }
  return {
    fn1,fn2
  }
});
