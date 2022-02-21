var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _EventHandler_stack;
export class EventHandler {
    constructor() {
        _EventHandler_stack.set(this, {});
    }
    handle(event, ...args) {
        (__classPrivateFieldGet(this, _EventHandler_stack, "f")[event] || []).forEach((item) => item(...args));
    }
    off(event, handler) {
        if (!handler) {
            __classPrivateFieldGet(this, _EventHandler_stack, "f")[event] = [];
        }
        __classPrivateFieldGet(this, _EventHandler_stack, "f")[event] = (__classPrivateFieldGet(this, _EventHandler_stack, "f")[event] || []).filter((item) => item !== handler);
    }
    on(event, handler) {
        if (!__classPrivateFieldGet(this, _EventHandler_stack, "f")[event]) {
            __classPrivateFieldGet(this, _EventHandler_stack, "f")[event] = [];
        }
        __classPrivateFieldGet(this, _EventHandler_stack, "f")[event].push(handler);
    }
}
_EventHandler_stack = new WeakMap();
export default EventHandler;
//# sourceMappingURL=EventHandler.js.map