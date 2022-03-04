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
var _World_unknown, _World_lookupCache, _World_tiles, _World_height, _World_width;
export class World {
    constructor(world) {
        _World_unknown.set(this, (x, y) => ({
            _: 'Tile',
            id: `Tile-${x}--${y}`,
            city: null,
            goodyHut: null,
            improvements: [],
            isCoast: false,
            isLand: false,
            isWater: false,
            terrain: {
                _: 'Unknown',
                id: `UnknownTerrain-${x}--${y}`,
                features: [],
            },
            units: [],
            x,
            y,
            yields: [],
        }));
        _World_lookupCache.set(this, {});
        _World_tiles.set(this, void 0);
        _World_height.set(this, void 0);
        _World_width.set(this, void 0);
        __classPrivateFieldSet(this, _World_height, world.height, "f");
        __classPrivateFieldSet(this, _World_width, world.width, "f");
        __classPrivateFieldSet(this, _World_tiles, world.tiles || [], "f");
    }
    get(x, y) {
        while (x < 0) {
            x += __classPrivateFieldGet(this, _World_width, "f");
        }
        while (y < 0) {
            y += __classPrivateFieldGet(this, _World_height, "f");
        }
        while (x > __classPrivateFieldGet(this, _World_width, "f")) {
            x -= __classPrivateFieldGet(this, _World_width, "f");
        }
        while (y > __classPrivateFieldGet(this, _World_height, "f")) {
            y -= __classPrivateFieldGet(this, _World_height, "f");
        }
        const key = [x, y].toString();
        if (!(key in __classPrivateFieldGet(this, _World_lookupCache, "f"))) {
            const index = __classPrivateFieldGet(this, _World_tiles, "f").findIndex((tile) => tile.x === x && tile.y === y);
            if (index === -1) {
                return __classPrivateFieldGet(this, _World_unknown, "f").call(this, x, y);
            }
            __classPrivateFieldGet(this, _World_lookupCache, "f")[key] = index;
        }
        return __classPrivateFieldGet(this, _World_tiles, "f")[__classPrivateFieldGet(this, _World_lookupCache, "f")[key]];
        // return (
        //   this.#tiles.filter(
        //     (tile: Tile) =>
        //       tile.x === x % this.#width && tile.y === y % this.#height
        //   )[0] || {
        //     improvements: [],
        //     isLand: false,
        //     isOcean: false,
        //     terrain: {
        //       _: 'Unknown',
        //     },
        //     units: [],
        //     x,
        //     y,
        //     yields: [],
        //   }
        // );
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
        return __classPrivateFieldGet(this, _World_height, "f");
    }
    tiles() {
        return __classPrivateFieldGet(this, _World_tiles, "f");
    }
    width() {
        return __classPrivateFieldGet(this, _World_width, "f");
    }
    setTileData(tiles) {
        __classPrivateFieldSet(this, _World_tiles, tiles, "f");
    }
}
_World_unknown = new WeakMap(), _World_lookupCache = new WeakMap(), _World_tiles = new WeakMap(), _World_height = new WeakMap(), _World_width = new WeakMap();
export default World;
//# sourceMappingURL=World.js.map