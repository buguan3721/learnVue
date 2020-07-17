// 只需要重写会改变原数组的方法,7个,

let oldArrayMethods = Array.prototype;

export let arrayMethods = Object.create(oldArrayMethods); //原型链  新类 的__proto__ 指向 oldArrayMethods

const methods = ["pop", "push", "unshift", "shift", "reverse", "sort", "splice"];

methods.forEach((method) => {
  arrayMethods[method] = function (...args) {
    // AOP切片编程
    const result = oldArrayMethods[method].apply(this, args);
    // 如果插入的参数,还是一个对象
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice": // splice 中间有删除  新增  替换 只需要观测第三个参数
        inserted = args.slice(2);

      default:
        break;
    }
    let ob = this.__ob__;
    if (inserted) {
      ob.observeArray(inserted);
    }
    return result;
  };
});
