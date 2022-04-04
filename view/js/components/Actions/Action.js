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
var _Action_action, _Action_element;
import { e } from '../../lib/html.js';
export class Action {
    constructor(action) {
        _Action_action.set(this, void 0);
        _Action_element.set(this, void 0);
        __classPrivateFieldSet(this, _Action_action, action, "f");
        __classPrivateFieldSet(this, _Action_element, e('div.action'), "f");
        __classPrivateFieldGet(this, _Action_element, "f").addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                return;
            }
            event.stopPropagation();
        });
        this.build();
    }
    activate() { }
    build() { }
    complete() {
        const event = new CustomEvent('actioned', {
            bubbles: true,
            detail: this,
        });
        __classPrivateFieldGet(this, _Action_element, "f").dispatchEvent(event);
    }
    element() {
        return __classPrivateFieldGet(this, _Action_element, "f");
    }
    value() {
        return __classPrivateFieldGet(this, _Action_action, "f").value;
    }
}
_Action_action = new WeakMap(), _Action_element = new WeakMap();
export default Action;
//# sourceMappingURL=Action.js.map