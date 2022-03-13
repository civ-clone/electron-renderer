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
var _Actions_portal;
import { Element } from './Element.js';
import { e, h } from '../lib/html.js';
import ChooseResearch from './Actions/ChooseResearch.js';
import CityBuild from './Actions/CityBuild.js';
import EndTurn from './Actions/EndTurn.js';
export class Actions extends Element {
    constructor(container = e('div.actions'), portal) {
        super(container);
        _Actions_portal.set(this, void 0);
        __classPrivateFieldSet(this, _Actions_portal, portal, "f");
        this.element().addEventListener('actioned', (event) => event.detail.element().remove());
        this.element().addEventListener('keydown', (event) => {
            var _a, _b;
            const currentChild = document.activeElement;
            if (!(currentChild === null || currentChild === void 0 ? void 0 : currentChild.matches('div#actions, div#actions *'))) {
                return;
            }
            const { key } = event, children = Array.from(this.element().children);
            if (children.length === 0) {
                return;
            }
            // TODO: scroll the actions container if the element isn't visible
            if (currentChild === this.element()) {
                event.preventDefault();
                event.stopPropagation();
                if (key === 'UpArrow') {
                    (_a = currentChild.lastElementChild) === null || _a === void 0 ? void 0 : _a.focus();
                    return;
                }
                if (key === 'DownArrow') {
                    (_b = currentChild.firstElementChild) === null || _b === void 0 ? void 0 : _b.focus();
                    return;
                }
            }
            event.preventDefault();
            event.stopPropagation();
            let currentAction = currentChild === this.element()
                ? currentChild.lastElementChild
                : currentChild;
            while (currentAction.parentElement !== this.element()) {
                currentAction = currentAction.parentElement;
            }
            const currentIndex = children.indexOf(currentAction);
            if (key === 'UpArrow') {
                if (currentIndex > 0) {
                    children[currentIndex - 1].focus();
                    return;
                }
                children.pop().focus();
                return;
            }
            if (key === 'DownArrow') {
                if (currentIndex > children.length - 1) {
                    children.shift().focus();
                    return;
                }
                children[currentIndex + 1].focus();
                return;
            }
        });
    }
    build(actions) {
        this.empty();
        actions.forEach((playerAction) => {
            let action;
            switch (playerAction._) {
                // This is handled separately so no need to worry.
                case 'ActiveUnit':
                    return;
                case 'ChooseResearch':
                    action = new ChooseResearch(playerAction);
                    break;
                case 'CityBuild':
                    action = new CityBuild(playerAction, __classPrivateFieldGet(this, _Actions_portal, "f"));
                    break;
                case 'EndTurn':
                    action = new EndTurn(playerAction);
                    break;
                default:
                    console.log('need to handle ' + playerAction._);
                    return;
                // throw new TypeError(`Unknown action type '${action._}'.`);
            }
            this.element().prepend(h(action.element(), {
                click: () => action.activate(),
                keydown: ({ key }) => {
                    if (key === ' ' || key === 'Enter') {
                        action.activate();
                    }
                },
            }));
        });
    }
}
_Actions_portal = new WeakMap();
export default Actions;
//# sourceMappingURL=Actions.js.map