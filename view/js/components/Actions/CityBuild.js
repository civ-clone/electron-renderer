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
var _CityBuild_portal;
import { e } from '../../lib/html.js';
import Action from './Action.js';
import CityBuildSelectionWindow from '../CityBuildSelectionWindow.js';
export class CityBuild extends Action {
    constructor(action, portal) {
        super(action);
        _CityBuild_portal.set(this, void 0);
        __classPrivateFieldSet(this, _CityBuild_portal, portal, "f");
    }
    activate() {
        new CityBuildSelectionWindow(this.value(), () => this.complete(), {
            showCity: CityBuildSelectionWindow.showCityAction(this.value().city),
            showCityOnMap: CityBuildSelectionWindow.showCityOnMapAction(this.value().city, __classPrivateFieldGet(this, _CityBuild_portal, "f")),
        });
    }
    build() {
        const cityBuild = this.value();
        this.element().append(e(`button.cityBuild[title="What would you like to build in ${cityBuild.city.name}?"]`));
    }
    value() {
        return super.value();
    }
}
_CityBuild_portal = new WeakMap();
export default CityBuild;
//# sourceMappingURL=CityBuild.js.map