var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _element;
import { e } from '../lib/html.js';
export class Element {
    constructor(element = e('div')) {
        _element.set(this, void 0);
        __classPrivateFieldSet(this, _element, element);
    }
    build() { }
    clear() {
        while (__classPrivateFieldGet(this, _element).firstChild !== null) {
            __classPrivateFieldGet(this, _element).firstChild.remove();
        }
    }
    element() {
        return __classPrivateFieldGet(this, _element);
    }
}
_element = new WeakMap();
export default Element;
//# sourceMappingURL=Element.js.map