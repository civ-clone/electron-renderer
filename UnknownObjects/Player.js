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
var _Player_civilization;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
class Player extends DataObject_1.default {
    constructor(civilization) {
        super();
        _Player_civilization.set(this, void 0);
        __classPrivateFieldSet(this, _Player_civilization, civilization, "f");
        this.addKey('_', 'civilization');
    }
    static fromPlayer(player) {
        return new Player(player.civilization());
    }
    _() {
        return 'Player';
    }
    civilization() {
        return __classPrivateFieldGet(this, _Player_civilization, "f");
    }
}
exports.Player = Player;
_Player_civilization = new WeakMap();
exports.default = Player;
//# sourceMappingURL=Player.js.map