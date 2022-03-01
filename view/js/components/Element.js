var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Element_element;
import { e } from '../lib/html.js';
export class Element {
    constructor(element = e('div')) {
        _Element_element.set(this, void 0);
        __classPrivateFieldSet(this, _Element_element, element, "f");
    }
    build(...args) { }
    element() {
        return __classPrivateFieldGet(this, _Element_element, "f");
    }
    empty() {
        while (__classPrivateFieldGet(this, _Element_element, "f").firstChild !== null) {
            __classPrivateFieldGet(this, _Element_element, "f").firstChild.remove();
        }
    }
}
_Element_element = new WeakMap();
export default Element;
//# sourceMappingURL=Element.js.map