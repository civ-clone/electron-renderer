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
var _TransientElement_parent;
import { e } from '../lib/html.js';
import { Element } from './Element.js';
export class TransientElement extends Element {
    constructor(parent, element = e('div')) {
        super(element);
        _TransientElement_parent.set(this, void 0);
        // capture keys in the notification window
        this.element().addEventListener('keydown', (event) => {
            event.stopPropagation();
        });
        this.element().setAttribute('tabindex', '0');
        __classPrivateFieldSet(this, _TransientElement_parent, parent, "f");
    }
    display() {
        this.build();
        __classPrivateFieldGet(this, _TransientElement_parent, "f").append(this.element());
    }
    parent() {
        return __classPrivateFieldGet(this, _TransientElement_parent, "f");
    }
}
_TransientElement_parent = new WeakMap();
export default TransientElement;
//# sourceMappingURL=TransientElement.js.map