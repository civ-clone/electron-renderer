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
var _parent;
import { e } from '../lib/html.js';
import { Element } from './Element.js';
export class TransientElement extends Element {
    constructor(parent, element = e('div')) {
        super(element);
        _parent.set(this, void 0);
        __classPrivateFieldSet(this, _parent, parent);
    }
    display() {
        this.build();
        __classPrivateFieldGet(this, _parent).append(this.element());
    }
    parent() {
        return __classPrivateFieldGet(this, _parent);
    }
}
_parent = new WeakMap();
export default TransientElement;
//# sourceMappingURL=TransientElement.js.map