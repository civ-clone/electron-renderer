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
var _UnitDetails_activeUnit;
import { e, t } from '../lib/html.js';
import Element from './Element.js';
export class UnitDetails extends Element {
    constructor(element, activeUnit) {
        super(element);
        _UnitDetails_activeUnit.set(this, void 0);
        __classPrivateFieldSet(this, _UnitDetails_activeUnit, activeUnit, "f");
        this.build();
    }
    build() {
        this.empty();
        if (__classPrivateFieldGet(this, _UnitDetails_activeUnit, "f") === null) {
            return;
        }
        this.element().append(e('p', t(`${__classPrivateFieldGet(this, _UnitDetails_activeUnit, "f")._} (${__classPrivateFieldGet(this, _UnitDetails_activeUnit, "f").tile.x}, ${__classPrivateFieldGet(this, _UnitDetails_activeUnit, "f").tile.y})`)), e('p', t(`${__classPrivateFieldGet(this, _UnitDetails_activeUnit, "f").moves.value} / ${__classPrivateFieldGet(this, _UnitDetails_activeUnit, "f").movement.value} moves`)), e('p', t(`A: ${__classPrivateFieldGet(this, _UnitDetails_activeUnit, "f").attack.value} / D: ${__classPrivateFieldGet(this, _UnitDetails_activeUnit, "f").defence.value} / V: ${__classPrivateFieldGet(this, _UnitDetails_activeUnit, "f").visibility.value}`)), e('p', t(`${__classPrivateFieldGet(this, _UnitDetails_activeUnit, "f").improvements
            .map((improvement) => improvement._)
            .join(', ')}`)), e('p', t(`${__classPrivateFieldGet(this, _UnitDetails_activeUnit, "f").tile.units
            .filter((unit) => unit !== __classPrivateFieldGet(this, _UnitDetails_activeUnit, "f"))
            .map((unit) => unit._)
            .join(', ')}`)));
    }
}
_UnitDetails_activeUnit = new WeakMap();
export default UnitDetails;
//# sourceMappingURL=UnitDetails.js.map