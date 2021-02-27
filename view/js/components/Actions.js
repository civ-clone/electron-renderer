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
var _actions, _element;
import { e } from '../lib/html.js';
import ChooseResearch from './Actions/ChooseResearch.js';
import CityBuild from './Actions/CityBuild.js';
export class Actions {
    constructor(actions, container = e('div.actions')) {
        _actions.set(this, []);
        _element.set(this, void 0);
        __classPrivateFieldSet(this, _element, container);
        while (container.firstChild !== null) {
            container.firstChild.remove();
        }
        actions.forEach((action) => {
            let actionInstance;
            switch (action._) {
                case 'ChooseResearch':
                    actionInstance = new ChooseResearch(action);
                    break;
                case 'CityBuild':
                    actionInstance = new CityBuild(action);
                    break;
                // This is handled separately so no need to worry.
                case 'ActiveUnit':
                    return;
                default:
                    console.log('need to handle ' + action._);
                    return;
                // throw new TypeError(`Unknown action type '${action._}'.`);
            }
            __classPrivateFieldGet(this, _actions).push(actionInstance);
        });
        __classPrivateFieldGet(this, _element).addEventListener('actioned', (event) => {
            __classPrivateFieldGet(this, _actions).splice(__classPrivateFieldGet(this, _actions).indexOf(event.detail), 1);
            event.detail.element().remove();
            this.build();
        });
        this.build();
    }
    build() {
        __classPrivateFieldGet(this, _actions).forEach((action) => {
            __classPrivateFieldGet(this, _element).prepend(action.element());
        });
    }
    element() {
        return __classPrivateFieldGet(this, _element);
    }
}
_actions = new WeakMap(), _element = new WeakMap();
export default Actions;
//# sourceMappingURL=Actions.js.map