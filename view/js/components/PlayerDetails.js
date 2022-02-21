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
var _PlayerDetails_player;
import { e, t } from '../lib/html.js';
import Element from './Element.js';
export class PlayerDetails extends Element {
    constructor(element, player) {
        super(element);
        _PlayerDetails_player.set(this, void 0);
        __classPrivateFieldSet(this, _PlayerDetails_player, player, "f");
    }
    build() {
        this.empty();
        const { civilization, treasury, research } = __classPrivateFieldGet(this, _PlayerDetails_player, "f");
        this.element().append(e('h3', t(`${civilization.leader.name} of the ${civilization._} empire`)), e('p', t(`Researching ${research.researching
            ? `${research.researching._} (${research.progress.value}/${research.cost.value})`
            : 'nothing'}`)), e('p', t(`Treasury ${treasury.value}`)));
    }
}
_PlayerDetails_player = new WeakMap();
export default PlayerDetails;
//# sourceMappingURL=PlayerDetails.js.map