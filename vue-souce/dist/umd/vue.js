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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
  var root = null;
  var currentParent; //记录当前的父亲是谁

  var stack = [];
  var ELEMENT_TYPE = 1;
  var TEXT_TYPE = 3;

  function creatAstElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs: attrs,
      parent: null
    };
  }

  function start(tagName, attrs) {
    var element = creatAstElement(tagName, attrs);

    if (!root) {
      root = element;
    }

    currentParent = element;
    stack.push(element); //在当前栈中存放开始标签
  }

  function chars(text) {
    text = text.replace(/\s/g, "");

    if (text) {
      currentParent.children.push({
        text: text,
        type: TEXT_TYPE
      });
    }
  }

  function end(tagName) {
    var element = stack.pop(); // 取出栈中的最后一个

    currentParent = stack[stack.length - 1];

    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }

  function parseHTML(html) {
    while (html) {
      var textEnd = html.indexOf("<");

      if (textEnd == 0) {
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      var text = void 0;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);

        var attr, _end;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3]
          });
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  function gen(node) {
    if (node.type == 1) {
      return generate(node);
    } else {
      var text = node.text;

      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      }

      var lastIndex = defaultTagRE.lastIndex = 0;
      var tokens = [];
      var match, index;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join("+"), ")");
    }
  }

  function getChildren(el) {
    // 生成儿子节点
    var children = el.children;

    if (children) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(","));
    } else {
      return false;
    }
  }

  function genProps(attrs) {
    // 生成属性
    var str = "";

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === "style") {
        (function () {
          var obj = {};
          attr.value.split(";").forEach(function (item) {
            var _item$split = item.split(":"),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function generate(el) {
    var children = getChildren(el);
    var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : "undefined").concat(children ? ",".concat(children) : "", ")");
    return code;
  }

  function compileToFunctions(template) {
    var root = parseHTML(template);
    var code = generate(root);
    var render = "with(this){return ".concat(code, "}");
    var renderFn = new Function(render);
    return renderFn;
  }

  function initMixin(Vue) {
    //初始化流程
    Vue.prototype._init = function (options) {
      //数据的劫持
      var vm = this; // vue 中使用 this.$options 指代的就是用户传递的属性

      vm.$options = options;
      initState(vm); // 如果用户传入了 el ,需要将页面渲染出来

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); //默认先会查找有没有render函数 ,没有render 采用template template也没有就用el中的内容

      if (!options.render) {
        //对模板进行编译
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        var render = compileToFunctions(template);
        options.render = render; //需要将template 转换成render 方法;
      }

      options.render();
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
