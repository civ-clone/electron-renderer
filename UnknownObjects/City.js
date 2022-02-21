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
var _City_name, _City_player, _City_growth, _City_tile;
Object.defineProperty(exports, "__esModule", { value: true });
exports.City = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
const CityGrowthRegistry_1 = require("@civ-clone/core-city-growth/CityGrowthRegistry");
class City extends DataObject_1.default {
    constructor(name, tile, player, size) {
        super();
        _City_name.set(this, void 0);
        _City_player.set(this, void 0);
        _City_growth.set(this, {
            size: 0,
        });
        _City_tile.set(this, void 0);
        __classPrivateFieldSet(this, _City_name, name, "f");
        __classPrivateFieldSet(this, _City_player, player, "f");
        __classPrivateFieldGet(this, _City_growth, "f").size = size;
        __classPrivateFieldSet(this, _City_tile, tile, "f");
        this.addKey('_', 'growth', 'name', 'player', 'tile');
    }
    static fromCity(city) {
        const cityGrowth = CityGrowthRegistry_1.instance.getByCity(city);
        return new City(city.name(), city.tile(), city.player(), cityGrowth.size());
    }
    _() {
        return 'City';
    }
    name() {
        return __classPrivateFieldGet(this, _City_name, "f");
    }
    player() {
        return __classPrivateFieldGet(this, _City_player, "f");
    }
    growth() {
        return __classPrivateFieldGet(this, _City_growth, "f");
    }
    tile() {
        return __classPrivateFieldGet(this, _City_tile, "f");
    }
}
exports.City = City;
_City_name = new WeakMap(), _City_player = new WeakMap(), _City_growth = new WeakMap(), _City_tile = new WeakMap();
exports.default = City;
//# sourceMappingURL=City.js.map