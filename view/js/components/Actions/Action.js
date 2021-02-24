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
var _action, _element;
import { a, e } from '../../lib/html.js';
export class Action {
    constructor(action) {
        _action.set(this, void 0);
        _element.set(this, void 0);
        __classPrivateFieldSet(this, _action, action);
        __classPrivateFieldSet(this, _element, a(e('div'), {
            class: 'action',
        }));
        this.build();
    }
    build() { }
    complete() {
        const event = new CustomEvent('actioned', {
            bubbles: true,
            detail: this,
        });
        __classPrivateFieldGet(this, _element).dispatchEvent(event);
    }
    element() {
        return __classPrivateFieldGet(this, _element);
    }
    value() {
        return __classPrivateFieldGet(this, _action).value;
    }
}
_action = new WeakMap(), _element = new WeakMap();
export default Action;
//# sourceMappingURL=Action.js.map