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
var _player;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyPlayer = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
class EnemyPlayer extends DataObject_1.default {
    constructor(player) {
        super();
        _player.set(this, void 0);
        __classPrivateFieldSet(this, _player, player);
        this.addKey('civilization');
    }
    static get(player) {
        if (!this.playerMap.get(player)) {
            this.playerMap.set(player, new EnemyPlayer(player));
        }
        return this.playerMap.get(player);
    }
    civilization() {
        return __classPrivateFieldGet(this, _player).civilization();
    }
}
exports.EnemyPlayer = EnemyPlayer;
_player = new WeakMap();
EnemyPlayer.playerMap = new Map();
exports.default = EnemyPlayer;
//# sourceMappingURL=EnemyPlayer.js.map