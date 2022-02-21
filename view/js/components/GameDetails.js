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
var _GameDetails_turn, _GameDetails_year;
import { e, t } from '../lib/html.js';
import Element from './Element.js';
export class GameDetails extends Element {
    constructor(element, turn, year) {
        super(element);
        _GameDetails_turn.set(this, void 0);
        _GameDetails_year.set(this, void 0);
        __classPrivateFieldSet(this, _GameDetails_turn, turn, "f");
        __classPrivateFieldSet(this, _GameDetails_year, year, "f");
    }
    build() {
        this.empty();
        this.element().append(e('h3', e('span#year', t(this.year())), e('span#turn', t(`(${__classPrivateFieldGet(this, _GameDetails_turn, "f").value.toString()})`))));
    }
    year(year = __classPrivateFieldGet(this, _GameDetails_year, "f").value) {
        if (year < 0) {
            return Math.abs(year) + ' BCE';
        }
        if (year === 0) {
            return '1 CE';
        }
        return year + ' CE';
    }
}
_GameDetails_turn = new WeakMap(), _GameDetails_year = new WeakMap();
export default GameDetails;
//# sourceMappingURL=GameDetails.js.map