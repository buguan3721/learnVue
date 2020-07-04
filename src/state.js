import { observe } from "./observe/index.js";
export function initState(vm) {
  const opts = vm.$options;
  // vue 的数据来源 属性 方法 数据 计算属性 watch
  if (opts.props) {
    initProps(vm);
  }
  if (opts.methods) {
    initMethod(vm);
  }
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}
function initProps() {}
function initMethod() {}
function initData(vm) {
  //初始化数据
  let data = vm.$options.data;
  data = typeof data === "function" ? data.call(vm) : data;
  vm._data = data;
  //对象劫持 用户改变了数据 我希望可以得到通知 => 刷新页面
  // MVVM 数据变化 驱动 视图变化
  // Object.definedProperty(); 给属性增加 set 和 get 方法
  observe(data); //响应式原理
}
function initComputed() {}
function initWatch() {}
