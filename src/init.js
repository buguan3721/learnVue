import { initState } from "./state.js";
import { compileToFunctions } from "./compile/index.js";
export function initMixin(Vue) {
	//初始化流程
	Vue.prototype._init = function (options) {
		//数据的劫持
		const vm = this; // vue 中使用 this.$options 指代的就是用户传递的属性
		vm.$options = options;
		initState(vm);

		// 如果用户传入了 el ,需要将页面渲染出来
		if (vm.$options.el) {
			vm.$mount(vm.$options.el);
		}
	};
	Vue.prototype.$mount = function (el) {
		let vm = this;
		let options = vm.$options;
		el = document.querySelector(el);
		//默认先会查找有没有render函数 ,没有render 采用template template也没有就用el中的内容

		if (!options.render) {
			//对模板进行编译
			let template = options.template;
			if (!template && el) {
				template = el.outerHTML;
			}
			const render = compileToFunctions(template);
			options.render = render;
			//需要将template 转换成render 方法;
		}
		options.render();
	};
}
