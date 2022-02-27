"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DataQueue_queue;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataQueue = void 0;
class DataQueue {
    constructor() {
        _DataQueue_queue.set(this, []);
    }
    add(targetId, value, index = null) {
        __classPrivateFieldGet(this, _DataQueue_queue, "f").push({
            [targetId]: {
                type: 'add',
                index,
                value,
            },
        });
    }
    clear() {
        __classPrivateFieldGet(this, _DataQueue_queue, "f").splice(0);
    }
    remove(targetId, index = null) {
        __classPrivateFieldGet(this, _DataQueue_queue, "f").push({
            [targetId]: {
                type: 'remove',
                index,
            },
        });
    }
    // TODO: look at chunking the data transfer
    transferData() {
        return __classPrivateFieldGet(this, _DataQueue_queue, "f").slice(0).map((patch) => {
            const patchData = {};
            Object.entries(patch).forEach(([key, { type, index, value }]) => {
                patchData[key] = {
                    type,
                    index,
                    value: typeof value === 'function' ? value() : value,
                };
            });
            return patchData;
        });
    }
    update(targetId, value, index = null) {
        __classPrivateFieldGet(this, _DataQueue_queue, "f").push({
            [targetId]: {
                type: 'update',
                index,
                value,
            },
        });
    }
}
exports.DataQueue = DataQueue;
_DataQueue_queue = new WeakMap();
exports.default = DataQueue;
//# sourceMappingURL=DataQueue.js.map