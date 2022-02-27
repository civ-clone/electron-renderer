"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryFailed = void 0;
class RetryFailed extends Error {
    constructor(message, handler, attempts) {
        super(message);
        this.handler = handler;
        this.attempts = attempts;
    }
}
exports.RetryFailed = RetryFailed;
exports.default = RetryFailed;
//# sourceMappingURL=RetryFailed.js.map