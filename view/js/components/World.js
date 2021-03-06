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
var _tiles, _height, _width;
export class World {
    constructor(world) {
        _tiles.set(this, void 0);
        _height.set(this, void 0);
        _width.set(this, void 0);
        __classPrivateFieldSet(this, _height, world.height);
        __classPrivateFieldSet(this, _width, world.width);
        __classPrivateFieldSet(this, _tiles, world.tiles || []);
    }
    get(x, y) {
        while (x < 0) {
            x += __classPrivateFieldGet(this, _width);
        }
        while (y < 0) {
            y += __classPrivateFieldGet(this, _height);
        }
        return (__classPrivateFieldGet(this, _tiles).filter((tile) => tile.x === x % __classPrivateFieldGet(this, _width) && tile.y === y % __classPrivateFieldGet(this, _height))[0] || {
            improvements: [],
            isLand: false,
            isOcean: false,
            terrain: {
                _: 'Unknown',
            },
            units: [],
            x,
            y,
            yields: [],
        });
    }
    getNeighbour(tile, direction) {
        if (direction === 'n') {
            return this.get(tile.x, tile.y - 1);
        }
        if (direction === 'ne') {
            return this.get(tile.x + 1, tile.y - 1);
        }
        if (direction === 'e') {
            return this.get(tile.x + 1, tile.y);
        }
        if (direction === 'se') {
            return this.get(tile.x + 1, tile.y + 1);
        }
        if (direction === 's') {
            return this.get(tile.x, tile.y + 1);
        }
        if (direction === 'sw') {
            return this.get(tile.x - 1, tile.y + 1);
        }
        if (direction === 'w') {
            return this.get(tile.x - 1, tile.y);
        }
        if (direction === 'nw') {
            return this.get(tile.x - 1, tile.y - 1);
        }
        throw new TypeError('Invalid direction.');
    }
    height() {
        return __classPrivateFieldGet(this, _height);
    }
    tiles() {
        return __classPrivateFieldGet(this, _tiles);
    }
    width() {
        return __classPrivateFieldGet(this, _width);
    }
    setTileData(tiles) {
        __classPrivateFieldSet(this, _tiles, tiles);
    }
}
_tiles = new WeakMap(), _height = new WeakMap(), _width = new WeakMap();
export default World;
//# sourceMappingURL=World.js.map