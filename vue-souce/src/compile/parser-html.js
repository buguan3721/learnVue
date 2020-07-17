const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

let root = null;
let currentParent; //记录当前的父亲是谁
let stack = [];
const ELEMENT_TYPE = 1;
const TEXT_TYPE = 3;

function creatAstElement(tagName, attrs) {
	return {
		tag: tagName,
		type: ELEMENT_TYPE,
		children: [],
		attrs,
		parent: null,
	};
}

function start(tagName, attrs) {
	let element = creatAstElement(tagName, attrs);
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
			text,
			type: TEXT_TYPE,
		});
	}
}

function end(tagName) {
	let element = stack.pop(); // 取出栈中的最后一个
	currentParent = stack[stack.length - 1];
	if(currentParent){
		element.parent = currentParent;
		currentParent.children.push(element);
	}
}
 export function parseHTML(html) {
	while (html) {
		let textEnd = html.indexOf("<");
		if (textEnd == 0) {
			const startTagMatch = parseStartTag();
			if (startTagMatch) {
				start(startTagMatch.tagName, startTagMatch.attrs);
				continue;
			}
			const endTagMatch = html.match(endTag);
			if (endTagMatch) {
				advance(endTagMatch[0].length);
				end(endTagMatch[1]);
				continue;
			}
		}
		let text;
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
		const start = html.match(startTagOpen);
		if (start) {
			const match = {
				tagName: start[1],
				attrs: [],
			};
			advance(start[0].length);
			let attr, end;
			while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
				advance(attr[0].length);
				match.attrs.push({ name: attr[1], value: attr[3] });
			}
			if (end) {
				advance(end[0].length);
				return match;
			}
		}
	}
	return root;
}