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
var _city, _player;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyCity = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
const EnemyPlayer_1 = require("./EnemyPlayer");
const CityGrowthRegistry_1 = require("@civ-clone/core-city-growth/CityGrowthRegistry");
class EnemyCity extends DataObject_1.default {
    constructor(city) {
        super();
        _city.set(this, void 0);
        _player.set(this, void 0);
        __classPrivateFieldSet(this, _city, city);
        __classPrivateFieldSet(this, _player, EnemyPlayer_1.default.get(city.player()));
        this.addKey('growth', 'name', 'player');
    }
    static get(city) {
        if (!this.cityMap.get(city)) {
            this.cityMap.set(city, new EnemyCity(city));
        }
        return this.cityMap.get(city);
    }
    growth() {
        const cityGrowth = CityGrowthRegistry_1.instance.getByCity(__classPrivateFieldGet(this, _city));
        return {
            size: cityGrowth.size(),
        };
    }
    name() {
        return __classPrivateFieldGet(this, _city).name();
    }
    player() {
        return __classPrivateFieldGet(this, _player);
    }
}
exports.EnemyCity = EnemyCity;
_city = new WeakMap(), _player = new WeakMap();
EnemyCity.cityMap = new Map();
exports.default = EnemyCity;
//# sourceMappingURL=EnemyCity.js.map