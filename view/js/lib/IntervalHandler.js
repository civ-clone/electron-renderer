var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _paused, _stack;
export class IntervalHandler {
    constructor(tick = 500) {
        _paused.set(this, false);
        _stack.set(this, []);
        setInterval(() => this.check(), tick);
    }
    check() {
        if (__classPrivateFieldGet(this, _paused)) {
            return;
        }
        __classPrivateFieldGet(this, _stack).forEach((item) => item());
    }
    clear() {
        __classPrivateFieldSet(this, _stack, []);
    }
    off(handler) {
        __classPrivateFieldSet(this, _stack, __classPrivateFieldGet(this, _stack).filter((item) => item !== handler));
    }
    on(handler) {
        __classPrivateFieldGet(this, _stack).push(handler);
    }
    pause() {
        __classPrivateFieldSet(this, _paused, true);
    }
    isPaused() {
        return __classPrivateFieldGet(this, _paused);
    }
    resume() {
        __classPrivateFieldSet(this, _paused, false);
    }
}
_paused = new WeakMap(), _stack = new WeakMap();
export default IntervalHandler;
//# sourceMappingURL=IntervalHandler.js.map