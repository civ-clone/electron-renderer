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
var _LockedSlider_label, _LockedSlider_range, _LockedSlider_number, _LockedSlider_lock, _LockedSlider_listeners;
import Element from './Element.js';
import { e, t } from '../lib/html.js';
const template = (label, value) => e('fieldset', e('legend', t(label)), e(`input[type="range"][max="100"][min="0"][step="1"][value="${value}"]`), e('input[type="number"]'), e('label', e('input[type="checkbox"]'), t('Lock')));
export class LockedSlider extends Element {
    constructor(label, currentValue) {
        super(template(label, currentValue));
        _LockedSlider_label.set(this, void 0);
        _LockedSlider_range.set(this, void 0);
        _LockedSlider_number.set(this, void 0);
        _LockedSlider_lock.set(this, void 0);
        _LockedSlider_listeners.set(this, []);
        __classPrivateFieldSet(this, _LockedSlider_label, label, "f");
        __classPrivateFieldSet(this, _LockedSlider_range, this.element().querySelector('input[type="range"]'), "f");
        __classPrivateFieldSet(this, _LockedSlider_number, this.element().querySelector('input[type="number"]'), "f");
        __classPrivateFieldSet(this, _LockedSlider_lock, this.element().querySelector('input[type="checkbox"]'), "f");
        this.build();
    }
    build() {
        this.set(__classPrivateFieldGet(this, _LockedSlider_range, "f").value);
        __classPrivateFieldGet(this, _LockedSlider_range, "f").addEventListener('input', () => this.set(__classPrivateFieldGet(this, _LockedSlider_range, "f").value));
        __classPrivateFieldGet(this, _LockedSlider_number, "f").addEventListener('input', () => this.set(__classPrivateFieldGet(this, _LockedSlider_number, "f").value));
        __classPrivateFieldGet(this, _LockedSlider_lock, "f").addEventListener('input', () => this.lock());
        this.lock();
    }
    label() {
        return __classPrivateFieldGet(this, _LockedSlider_label, "f");
    }
    lock() {
        if (this.isLocked()) {
            __classPrivateFieldGet(this, _LockedSlider_range, "f").setAttribute('disabled', '');
            __classPrivateFieldGet(this, _LockedSlider_number, "f").setAttribute('disabled', '');
            return;
        }
        __classPrivateFieldGet(this, _LockedSlider_range, "f").removeAttribute('disabled');
        __classPrivateFieldGet(this, _LockedSlider_number, "f").removeAttribute('disabled');
    }
    onInput(handler) {
        __classPrivateFieldGet(this, _LockedSlider_listeners, "f").push(handler);
    }
    isLocked() {
        return __classPrivateFieldGet(this, _LockedSlider_lock, "f").checked;
    }
    set(value) {
        value = Math.max(parseInt(value, 10), 0).toString();
        if (__classPrivateFieldGet(this, _LockedSlider_range, "f").value !== value) {
            __classPrivateFieldGet(this, _LockedSlider_range, "f").value = value;
        }
        if (__classPrivateFieldGet(this, _LockedSlider_number, "f").value !== value) {
            __classPrivateFieldGet(this, _LockedSlider_number, "f").value = value;
        }
        __classPrivateFieldGet(this, _LockedSlider_listeners, "f").forEach((listener) => listener());
    }
    value() {
        return parseInt(__classPrivateFieldGet(this, _LockedSlider_range, "f").value, 10);
    }
}
_LockedSlider_label = new WeakMap(), _LockedSlider_range = new WeakMap(), _LockedSlider_number = new WeakMap(), _LockedSlider_lock = new WeakMap(), _LockedSlider_listeners = new WeakMap();
export default LockedSlider;
//# sourceMappingURL=LockedSlider.js.map