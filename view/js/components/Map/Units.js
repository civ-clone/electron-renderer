var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _activeUnit;
import { Map } from '../Map.js';
export class Units extends Map {
    constructor() {
        super(...arguments);
        _activeUnit.set(this, null);
    }
    render(tiles = this.world().tiles()) {
        this.clear();
        tiles.forEach(({ x, y }) => {
            const tile = this.world().get(x, y), size = this.tileSize(), offsetX = x * size, offsetY = y * size;
            if (tile.units.length > 0 &&
                (__classPrivateFieldGet(this, _activeUnit) !== null
                    ? __classPrivateFieldGet(this, _activeUnit).tile.id !== tile.id
                    : true)) {
                const [unit] = tile.units.sort((a, b) => b.defence.value - a.defence.value), player = unit.player, civilization = player.civilization, [colors] = civilization.attributes.filter((attribute) => attribute.name === 'colors'), image = this.replaceColors(this.getPreloadedImage(`units/${unit._.toLowerCase()}`), ['#61e365', '#2c7900'], colors.value);
                if (tile.units.length > 1) {
                    this.putImage(image, offsetX - this.scale(), offsetY - this.scale());
                }
                this.putImage(image, offsetX, offsetY);
                if (unit.improvements.some((improvement) => improvement._ === 'Fortified')) {
                    this.drawImage('map/fortify', x, y);
                }
            }
        });
    }
    setActiveUnit(unit) {
        __classPrivateFieldSet(this, _activeUnit, unit);
    }
    activeUnit() {
        return __classPrivateFieldGet(this, _activeUnit);
    }
}
_activeUnit = new WeakMap();
export default Units;
//# sourceMappingURL=Units.js.map