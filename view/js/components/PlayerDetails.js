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
var _player;
import { e, t } from '../lib/html.js';
import Element from './Element.js';
export class PlayerDetails extends Element {
    constructor(element, player) {
        super(element);
        _player.set(this, void 0);
        __classPrivateFieldSet(this, _player, player);
    }
    build() {
        this.clear();
        const { civilization, treasury, research } = __classPrivateFieldGet(this, _player);
        this.element().append(e('h3', t(`${civilization.leader.name} of the ${civilization._} empire`)), e('p', t(`Researching ${research.researching
            ? `${research.researching._} (${research.progress.value}/${research.cost.value})`
            : 'nothing'}`)), e('p', t(`Treasury ${treasury.value}`)));
    }
}
_player = new WeakMap();
export default PlayerDetails;
//# sourceMappingURL=PlayerDetails.js.map