import Vue from "vue";
Vue.directive("longpress", {
  bind: function(el, binding, vNode) {
    if (typeof binding.value !== "function") {
      const compName = vNode.context.name;
      let warn = `${binding.expression} is not a funciton`;
      console.log(warn);
    }
    let start = e => {
      //如果是点击事件
      if (e.type === "click" && e.button !== 0) {
        return;
      }
      if (!pressTimer) {
        pressTimer = setTimeout(() => {
          binding.value(e);
        }, 2000);
      }
    };
    let cancel = e => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    //start
    el.addEventListener("mousedown", start);
    el.addEventListener("touchstart", start);
    //cancel
    el.addEventListener("touchcancel", cancel);
    el.addEventListener("touchend", cancel);
    el.addEventListener("click", cancel);
    el.addEventListener("mouseout", cancel);
  }
});
let insideClick, outsideClick;
Vue.directive("outsideClick", {
  inserted(el, binding, vnode) {
    el.addEventListener(
      "click",
      (insideClick = function(evt) {
        evt.stopPropagation();
        vnode.context[binding.arg] = true;
      })
    );
    document.body.addEventListener(
      "click",
      (outsideClick = function() {
        vnode.context[binding.arg] = false;
      })
    );
  },
  unbind(el, binding) {
    el.removeEventListener("click", insideClick);
    document.body.removeEventListener("click", outsideClick);
  }
});
