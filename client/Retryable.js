"use strict";
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
var _Retryable_attempt, _Retryable_done, _Retryable_handler, _Retryable_maxTries, _Retryable_reference, _Retryable_reject, _Retryable_resolve;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Retryable = void 0;
const RetryFailed_1 = require("./Error/RetryFailed");
class Retryable {
    constructor(handler, maxTries = 5, interval = 100) {
        _Retryable_attempt.set(this, 0);
        _Retryable_done.set(this, void 0);
        _Retryable_handler.set(this, void 0);
        _Retryable_maxTries.set(this, void 0);
        _Retryable_reference.set(this, void 0);
        // @ts-ignore
        _Retryable_reject.set(this, void 0);
        // @ts-ignore
        _Retryable_resolve.set(this, void 0);
        __classPrivateFieldSet(this, _Retryable_handler, handler, "f");
        __classPrivateFieldSet(this, _Retryable_maxTries, maxTries, "f");
        __classPrivateFieldSet(this, _Retryable_reference, setInterval(() => this.run(), interval), "f");
        __classPrivateFieldSet(this, _Retryable_done, new Promise((resolve, reject) => {
            __classPrivateFieldSet(this, _Retryable_resolve, resolve, "f");
            __classPrivateFieldSet(this, _Retryable_reject, reject, "f");
        }), "f");
    }
    run() {
        var _a;
        if (__classPrivateFieldSet(this, _Retryable_attempt, (_a = __classPrivateFieldGet(this, _Retryable_attempt, "f"), ++_a), "f") > __classPrivateFieldGet(this, _Retryable_maxTries, "f")) {
            clearInterval(__classPrivateFieldGet(this, _Retryable_reference, "f"));
            __classPrivateFieldGet(this, _Retryable_reject, "f").call(this, new RetryFailed_1.default('Retry failed.', __classPrivateFieldGet(this, _Retryable_handler, "f"), __classPrivateFieldGet(this, _Retryable_attempt, "f")));
            return;
        }
        if (__classPrivateFieldGet(this, _Retryable_handler, "f").call(this)) {
            clearInterval(__classPrivateFieldGet(this, _Retryable_reference, "f"));
            __classPrivateFieldGet(this, _Retryable_resolve, "f").call(this);
        }
    }
    then() {
        return __classPrivateFieldGet(this, _Retryable_done, "f");
    }
}
exports.Retryable = Retryable;
_Retryable_attempt = new WeakMap(), _Retryable_done = new WeakMap(), _Retryable_handler = new WeakMap(), _Retryable_maxTries = new WeakMap(), _Retryable_reference = new WeakMap(), _Retryable_reject = new WeakMap(), _Retryable_resolve = new WeakMap();
exports.default = Retryable;
//# sourceMappingURL=Retryable.js.map