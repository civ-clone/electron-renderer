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
var _city, _element;
import { a, e, t } from '../lib/html.js';
import Portal from './Portal.js';
import Terrain from './Map/Terrain';
import World from './World';
import Yields from './Map/Yields';
export class City {
    constructor(city, element = a(e('div'), {
        class: 'city',
    })) {
        _city.set(this, void 0);
        _element.set(this, void 0);
        __classPrivateFieldSet(this, _city, city);
        __classPrivateFieldSet(this, _element, element);
        this.build();
    }
    build() {
        const mapCanvas = e('canvas');
        const world = new World(__classPrivateFieldGet(this, _city).player.world), terrainMap = new Terrain(world), yieldWorld = new World(__classPrivateFieldGet(this, _city).player.world), yieldMap = new Yields(yieldWorld), map = new Portal(world, mapCanvas, terrainMap, yieldMap);
        map.setCenter(__classPrivateFieldGet(this, _city).tile.x, __classPrivateFieldGet(this, _city).tile.y);
        __classPrivateFieldGet(this, _element).append(e('header', e('h2', t(__classPrivateFieldGet(this, _city).name))), a(e('div', ...__classPrivateFieldGet(this, _city).yields.map((cityYield) => a(e('div', e('div', t(cityYield._)), e('div', t(cityYield.value.toString()))), {
            class: cityYield._.toLowerCase(),
        }))), {
            class: 'yields',
        }), a(e('div', mapCanvas), {
            class: 'map',
        }));
    }
    element() {
        return __classPrivateFieldGet(this, _element);
    }
}
_city = new WeakMap(), _element = new WeakMap();
export default City;
//# sourceMappingURL=City.js.map