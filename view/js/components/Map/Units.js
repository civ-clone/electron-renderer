var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Units_activeUnit;
import { Map } from '../Map.js';
const busyLookup = {
    BuildingIrrigation: 'I',
    BuildingMine: 'M',
    BuildingRoad: 'R',
    BuildingRailroad: 'RR',
    // 'ClearingForest': 'CF',
    // 'ClearingJungle': 'CJ',
    // 'ClearingSwamp': 'CS',
    // 'Fortifying': 'F',
    // 'Sleeping': 'S',
    // 'PlantingForest': 'PF',
};
export class Units extends Map {
    constructor() {
        super(...arguments);
        _Units_activeUnit.set(this, null);
    }
    renderTile(tile) {
        var _a, _b;
        super.renderTile(tile);
        const { x, y } = tile, size = this.tileSize(), offsetX = x * size, offsetY = y * size;
        if (tile.units.length > 0 &&
            (__classPrivateFieldGet(this, _Units_activeUnit, "f") !== null ? __classPrivateFieldGet(this, _Units_activeUnit, "f").tile.id !== tile.id : true)) {
            const [unit] = tile.units.sort((a, b) => { var _a, _b; return ((_a = b.defence) === null || _a === void 0 ? void 0 : _a.value) - ((_b = a.defence) === null || _b === void 0 ? void 0 : _b.value); }), image = this.renderUnit(unit);
            if (tile.units.length > 1) {
                this.putImage(image, offsetX - this.scale(), offsetY - this.scale());
            }
            this.putImage(image, offsetX, offsetY);
            if ((_a = unit.improvements) === null || _a === void 0 ? void 0 : _a.some((improvement) => improvement._ === 'Fortified')) {
                this.drawImage('map/fortify', x, y);
            }
            if (unit.busy) {
                // if (unit.busy._ === 'Sleeping') {} // TODO: fade the unit like in Civ 1
                const sizeOffsetX = this.tileSize() / 2, sizeOffsetY = this.tileSize() * 0.75, identifier = (_b = busyLookup[unit.busy._]) !== null && _b !== void 0 ? _b : unit.busy._.replace(/[a-z]+/g, '');
                this.context().font = `bold ${8 * this.scale()}px sans-serif`;
                this.context().fillStyle = 'black';
                this.context().textAlign = 'center';
                this.context().fillText(identifier, offsetX + sizeOffsetX + this.scale(), offsetY + sizeOffsetY + this.scale());
                this.context().fillStyle = 'white';
                this.context().fillText(identifier, offsetX + sizeOffsetX, offsetY + sizeOffsetY);
            }
        }
    }
    renderUnit(unit) {
        const player = unit.player, civilization = player.civilization, [colors] = civilization.attributes.filter((attribute) => attribute.name === 'colors');
        return this.replaceColors(this.getPreloadedImage(`units/${unit._.toLowerCase()}`), 
        // To come from theme manifest
        ['#60E064', '#2C7800'], colors.value);
    }
    setActiveUnit(unit) {
        __classPrivateFieldSet(this, _Units_activeUnit, unit, "f");
    }
    activeUnit() {
        return __classPrivateFieldGet(this, _Units_activeUnit, "f");
    }
}
_Units_activeUnit = new WeakMap();
export default Units;
//# sourceMappingURL=Units.js.map