export function isObject(data) {
  return typeof data === "object" && data !== null;
}
export function def(object, key, value) {
  Object.defineProperty(object, key, {
    enumerable: false, //不可枚举
    configurable: false, //不可改写
    value,
  });
}
