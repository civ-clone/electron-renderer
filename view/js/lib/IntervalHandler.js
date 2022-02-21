var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _IntervalHandler_paused, _IntervalHandler_stack;
export class IntervalHandler {
    constructor(tick = 500) {
        _IntervalHandler_paused.set(this, false);
        _IntervalHandler_stack.set(this, []);
        setInterval(() => this.check(), tick);
    }
    check() {
        if (__classPrivateFieldGet(this, _IntervalHandler_paused, "f")) {
            return;
        }
        __classPrivateFieldGet(this, _IntervalHandler_stack, "f").forEach((item) => item());
    }
    clear() {
        __classPrivateFieldSet(this, _IntervalHandler_stack, [], "f");
    }
    off(handler) {
        __classPrivateFieldSet(this, _IntervalHandler_stack, __classPrivateFieldGet(this, _IntervalHandler_stack, "f").filter((item) => item !== handler), "f");
    }
    on(handler) {
        __classPrivateFieldGet(this, _IntervalHandler_stack, "f").push(handler);
    }
    pause() {
        __classPrivateFieldSet(this, _IntervalHandler_paused, true, "f");
    }
    isPaused() {
        return __classPrivateFieldGet(this, _IntervalHandler_paused, "f");
    }
    resume() {
        __classPrivateFieldSet(this, _IntervalHandler_paused, false, "f");
    }
}
_IntervalHandler_paused = new WeakMap(), _IntervalHandler_stack = new WeakMap();
export default IntervalHandler;
//# sourceMappingURL=IntervalHandler.js.map