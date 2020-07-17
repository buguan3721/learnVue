import { isObject, def } from "../util/index";
import { arrayMethods } from "./array.js";

class Observe {
  constructor(value) {
    // 数据越复杂 层次越深 越费性能,vue2使用递归来给数据定义get 和set
    if (Array.isArray(value)) {
      // 如果是数组的话,并不应去检测数组的索引,浪费性能
      // 但是监控数组的 push pop shift unshift
      value.__ob__ = this; // 方便其他模块调用实例方法
      def(value, "__ob__", this);
      value.__proto__ = arrayMethods;
      this.observeArray(value); // 对数组内容拦截
    } else {
      this.walk(value);
    }
  }
  walk(data) {
    let keys = Object.keys(data);
    keys.forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
  observeArray(value) {
    for (let i = 0; i < value.length; i++) {
      observe(value[i]);
    }
  }
}
function defineReactive(data, key, value) {
  //响应式核心
  observe(value);
  Object.defineProperty(data, key, {
    set(newValue) {
      if (newValue === value) return;
      observe(newValue); // 更换数据后,继续添加监听
      value = newValue;
    },
    get() {
      return value;
    },
  });
}

export function observe(data) {
  if (!isObject(data)) {
    return;
  }
  return new Observe(data);
}
