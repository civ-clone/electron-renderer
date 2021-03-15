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
var _player, _tile;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicTile = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
const EnemyCity_1 = require("./EnemyCity");
const EnemyUnit_1 = require("./EnemyUnit");
const Player_1 = require("@civ-clone/core-player/Player");
const UnknownUnit_1 = require("./UnknownUnit");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const GoodyHutRegistry_1 = require("@civ-clone/core-goody-hut/GoodyHutRegistry");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
class BasicTile extends DataObject_1.default {
    constructor(tile, player) {
        super();
        _player.set(this, void 0);
        _tile.set(this, void 0);
        __classPrivateFieldSet(this, _player, player);
        __classPrivateFieldSet(this, _tile, tile);
        this.addKey('city', 'goodyHut', 'improvements', 'isCoast', 'isLand', 'isWater', 'terrain', 'units', 'x', 'y', 'yields');
    }
    static get(tile, player) {
        if (!this.tileMap.get(tile)) {
            this.tileMap.set(tile, new this(tile, player));
        }
        return this.tileMap.get(tile);
    }
    city() {
        const [city] = CityRegistry_1.instance.getByTile(__classPrivateFieldGet(this, _tile));
        if (city === undefined) {
            return null;
        }
        if (city.player() === __classPrivateFieldGet(this, _player)) {
            return city;
        }
        return EnemyCity_1.default.get(city);
    }
    goodyHut() {
        const goodyHut = GoodyHutRegistry_1.instance.getByTile(__classPrivateFieldGet(this, _tile));
        return goodyHut ? { _: 'GoodyHut', id: goodyHut.id() } : null;
    }
    id() {
        return __classPrivateFieldGet(this, _tile).id();
    }
    improvements() {
        return TileImprovementRegistry_1.instance.getByTile(__classPrivateFieldGet(this, _tile));
    }
    isCoast() {
        return __classPrivateFieldGet(this, _tile).isCoast();
    }
    isLand() {
        return __classPrivateFieldGet(this, _tile).isLand();
    }
    isWater() {
        return __classPrivateFieldGet(this, _tile).isWater();
    }
    terrain() {
        return __classPrivateFieldGet(this, _tile).terrain();
    }
    units() {
        const units = UnitRegistry_1.instance.getByTile(__classPrivateFieldGet(this, _tile));
        if (units.length === 0) {
            return [];
        }
        if (units[0].player() === __classPrivateFieldGet(this, _player)) {
            return units;
        }
        const [defensiveUnit] = units.sort((a, b) => b.defence().value() - a.defence().value());
        if (units.length === 1) {
            return [defensiveUnit];
        }
        return [EnemyUnit_1.default.get(defensiveUnit), UnknownUnit_1.default.get(defensiveUnit)];
    }
    x() {
        return __classPrivateFieldGet(this, _tile).x();
    }
    y() {
        return __classPrivateFieldGet(this, _tile).y();
    }
    yields(player = new Player_1.default()) {
        return __classPrivateFieldGet(this, _tile).yields(player);
    }
}
exports.BasicTile = BasicTile;
_player = new WeakMap(), _tile = new WeakMap();
BasicTile.tileMap = new Map();
exports.default = BasicTile;
//# sourceMappingURL=BasicTile.js.map