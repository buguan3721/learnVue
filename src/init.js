import { initState } from "./state.js";
export function initMixin(Vue) {
  //初始化流程
  Vue.prototype._init = function (options) {
    //数据的劫持
    const vm = this; // vue 中使用 this.$options 指代的就是用户传递的属性
    vm.$options = options;
    initState(vm);
  };
}
