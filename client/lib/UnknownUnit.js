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
var _player, _unit;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownUnit = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
const EnemyPlayer_1 = require("./EnemyPlayer");
class UnknownUnit extends DataObject_1.default {
    constructor(unit) {
        super();
        _player.set(this, void 0);
        _unit.set(this, void 0);
        __classPrivateFieldSet(this, _player, EnemyPlayer_1.default.get(unit.player()));
        __classPrivateFieldSet(this, _unit, unit);
        this.addKey('player');
    }
    static get(unit) {
        if (!this.unitMap.get(unit)) {
            this.unitMap.set(unit, new UnknownUnit(unit));
        }
        return this.unitMap.get(unit);
    }
    player() {
        return __classPrivateFieldGet(this, _player);
    }
}
exports.UnknownUnit = UnknownUnit;
_player = new WeakMap(), _unit = new WeakMap();
UnknownUnit.unitMap = new Map();
exports.default = UnknownUnit;
//# sourceMappingURL=UnknownUnit.js.map