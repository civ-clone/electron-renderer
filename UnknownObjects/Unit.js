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
var _Unit__, _Unit_tile, _Unit_player;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
class Unit extends DataObject_1.default {
    constructor(name, tile, player) {
        super();
        _Unit__.set(this, void 0);
        _Unit_tile.set(this, void 0);
        _Unit_player.set(this, void 0);
        __classPrivateFieldSet(this, _Unit__, name, "f");
        __classPrivateFieldSet(this, _Unit_tile, tile, "f");
        __classPrivateFieldSet(this, _Unit_player, player, "f");
        this.addKey('_', 'tile', 'player');
    }
    static fromUnit(unit) {
        return new Unit(unit.constructor.name, unit.tile(), unit.player());
    }
    _() {
        return __classPrivateFieldGet(this, _Unit__, "f");
    }
    player() {
        return __classPrivateFieldGet(this, _Unit_player, "f");
    }
    tile() {
        return __classPrivateFieldGet(this, _Unit_tile, "f");
    }
}
exports.Unit = Unit;
_Unit__ = new WeakMap(), _Unit_tile = new WeakMap(), _Unit_player = new WeakMap();
exports.default = Unit;
//# sourceMappingURL=Unit.js.map