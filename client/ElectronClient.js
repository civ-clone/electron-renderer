"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _sender, _receiver;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronClient = void 0;
const Client_1 = require("@civ-clone/core-civ-client/Client");
const TransferObject_1 = require("./TransferObject");
class ElectronClient extends Client_1.Client {
    constructor(player, sender, receiver) {
        super(player);
        _sender.set(this, void 0);
        _receiver.set(this, void 0);
        __classPrivateFieldSet(this, _sender, sender);
        __classPrivateFieldSet(this, _receiver, receiver);
    }
    sendGameData() {
        __classPrivateFieldGet(this, _sender).call(this, 'gameData', new TransferObject_1.default(this.player()).toPlainObject());
    }
    takeTurn() {
        return new Promise((resolve, reject) => {
            this.sendGameData();
            __classPrivateFieldGet(this, _receiver).call(this, 'move', (...args) => {
                console.log(...args);
                this.sendGameData();
            });
        });
    }
}
exports.ElectronClient = ElectronClient;
_sender = new WeakMap(), _receiver = new WeakMap();
exports.default = ElectronClient;
//# sourceMappingURL=ElectronClient.js.map