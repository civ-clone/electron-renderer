var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _stack;
export class EventHandler {
    constructor() {
        _stack.set(this, {});
    }
    handle(event, ...args) {
        (__classPrivateFieldGet(this, _stack)[event] || []).forEach((item) => item(...args));
    }
    off(event, handler) {
        if (!handler) {
            __classPrivateFieldGet(this, _stack)[event] = [];
        }
        __classPrivateFieldGet(this, _stack)[event] = (__classPrivateFieldGet(this, _stack)[event] || []).filter((item) => item !== handler);
    }
    on(event, handler) {
        if (!__classPrivateFieldGet(this, _stack)[event]) {
            __classPrivateFieldGet(this, _stack)[event] = [];
        }
        __classPrivateFieldGet(this, _stack)[event].push(handler);
    }
}
_stack = new WeakMap();
export default EventHandler;
//# sourceMappingURL=EventHandler.js.map