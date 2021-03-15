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
var _activeUnit;
import { e, t } from '../lib/html.js';
import Element from './Element.js';
export class UnitDetails extends Element {
    constructor(element, activeUnit) {
        super(element);
        _activeUnit.set(this, void 0);
        __classPrivateFieldSet(this, _activeUnit, activeUnit);
        this.build();
    }
    build() {
        this.clear();
        if (__classPrivateFieldGet(this, _activeUnit) === null) {
            return;
        }
        this.element().append(e('p', t(`${__classPrivateFieldGet(this, _activeUnit)._} (${__classPrivateFieldGet(this, _activeUnit).tile.x}, ${__classPrivateFieldGet(this, _activeUnit).tile.y})`)), e('p', t(`${__classPrivateFieldGet(this, _activeUnit).moves.value} / ${__classPrivateFieldGet(this, _activeUnit).movement.value} moves`)), e('p', t(`A: ${__classPrivateFieldGet(this, _activeUnit).attack.value} / D: ${__classPrivateFieldGet(this, _activeUnit).defence.value} / V: ${__classPrivateFieldGet(this, _activeUnit).visibility.value}`)), e('p', t(`${Object.values(__classPrivateFieldGet(this, _activeUnit).improvements)
            .map((improvement) => improvement._)
            .join(', ')}`)), e('p', t(`${Object.values(__classPrivateFieldGet(this, _activeUnit).tile.units)
            .filter((unit) => unit !== __classPrivateFieldGet(this, _activeUnit))
            .map((unit) => unit._)
            .join(', ')}`)));
    }
}
_activeUnit = new WeakMap();
export default UnitDetails;
//# sourceMappingURL=UnitDetails.js.map