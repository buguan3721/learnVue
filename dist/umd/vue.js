(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function isObject(data) {
    return _typeof(data) === "object" && data !== null;
  }
  function def(object, key, value) {
    Object.defineProperty(object, key, {
      enumerable: false,
      //不可枚举
      configurable: false,
      //不可改写
      value: value
    });
  }

  // 只需要重写会改变原数组的方法,7个,
  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayMethods); //原型链  新类 的__proto__ 指向 oldArrayMethods

  var methods = ["pop", "push", "unshift", "shift", "reverse", "sort", "splice"];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // AOP切片编程
      var result = oldArrayMethods[method].apply(this, args); // 如果插入的参数,还是一个对象

      var inserted;

      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
          break;

        case "splice":
          // splice 中间有删除  新增  替换 只需要观测第三个参数
          inserted = args.slice(2);
      }

      var ob = this.__ob__;

      if (inserted) {
        ob.observeArray(inserted);
      }

      return result;
    };
  });

  var Observe = /*#__PURE__*/function () {
    function Observe(value) {
      _classCallCheck(this, Observe);

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

    _createClass(Observe, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(value) {
        for (var i = 0; i < value.length; i++) {
          observe(value[i]);
        }
      }
    }]);

    return Observe;
  }();

  function defineReactive(data, key, value) {
    //响应式核心
    observe(value);
    Object.defineProperty(data, key, {
      set: function set(newValue) {
        if (newValue === value) return;
        observe(newValue); // 更换数据后,继续添加监听

        value = newValue;
      },
      get: function get() {
        return value;
      }
    });
  }

  function observe(data) {
    if (!isObject(data)) {
      return;
    }

    return new Observe(data);
  }

  function initState(vm) {
    var opts = vm.$options; // vue 的数据来源 属性 方法 数据 计算属性 watch

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function initData(vm) {
    //初始化数据
    var data = vm.$options.data;
    data = typeof data === "function" ? data.call(vm) : data;
    vm._data = data; //对象劫持 用户改变了数据 我希望可以得到通知 => 刷新页面
    // MVVM 数据变化 驱动 视图变化
    // Object.definedProperty(); 给属性增加 set 和 get 方法

    observe(data); //响应式原理
  }

  function initMixin(Vue) {
    //初始化流程
    Vue.prototype._init = function (options) {
      //数据的劫持
      var vm = this; // vue 中使用 this.$options 指代的就是用户传递的属性

      vm.$options = options;
      initState(vm);
    };
  }

  // Vue 声明文件

  function Vue(option) {
    this._init(option);
  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
