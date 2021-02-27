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
var _turn, _year;
import { e, t } from '../lib/html.js';
import Element from './Element.js';
export class GameDetails extends Element {
    constructor(element, turn, year) {
        super(element);
        _turn.set(this, void 0);
        _year.set(this, void 0);
        __classPrivateFieldSet(this, _turn, turn);
        __classPrivateFieldSet(this, _year, year);
    }
    build() {
        this.clear();
        this.element().append(e('h3', e('span#year', t(this.year())), e('span#turn', t(`(${__classPrivateFieldGet(this, _turn).value.toString()})`))));
    }
    year(year = __classPrivateFieldGet(this, _year).value) {
        if (year < 0) {
            return Math.abs(year) + ' BCE';
        }
        if (year === 0) {
            return '1 CE';
        }
        return year + ' CE';
    }
}
_turn = new WeakMap(), _year = new WeakMap();
export default GameDetails;
//# sourceMappingURL=GameDetails.js.map