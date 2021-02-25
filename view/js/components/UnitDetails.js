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
var _activeUnit, _element;
import { e, t } from '../lib/html.js';
export class UnitDetails {
    constructor(element, activeUnit) {
        _activeUnit.set(this, void 0);
        _element.set(this, void 0);
        __classPrivateFieldSet(this, _element, element);
        __classPrivateFieldSet(this, _activeUnit, activeUnit);
    }
    build() {
        while (__classPrivateFieldGet(this, _element).firstChild !== null) {
            __classPrivateFieldGet(this, _element).firstChild.remove();
        }
        if (__classPrivateFieldGet(this, _activeUnit) === null) {
            return;
        }
        __classPrivateFieldGet(this, _element).append(e('p', t(`${__classPrivateFieldGet(this, _activeUnit).player.civilization._} ${__classPrivateFieldGet(this, _activeUnit)._} (${__classPrivateFieldGet(this, _activeUnit).tile.x}, ${__classPrivateFieldGet(this, _activeUnit).tile.y})`)), e('p', t(`${__classPrivateFieldGet(this, _activeUnit).moves.value} / ${__classPrivateFieldGet(this, _activeUnit).movement.value} moves`)), e('p', t(`A: ${__classPrivateFieldGet(this, _activeUnit).attack.value} / D: ${__classPrivateFieldGet(this, _activeUnit).defence.value} / V: ${__classPrivateFieldGet(this, _activeUnit).visibility.value}`)), e('p', t(`${__classPrivateFieldGet(this, _activeUnit).improvements
            .map((improvement) => improvement._)
            .join(', ')}`)));
    }
    element() {
        return __classPrivateFieldGet(this, _element);
    }
}
_activeUnit = new WeakMap(), _element = new WeakMap();
//# sourceMappingURL=UnitDetails.js.map