var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _AdjustTradeRates_sliderGroup;
import Action from './Action.js';
import LockedSlider from '../LockedSlider.js';
import LockedSliderGroup from '../LockedSliderGroup.js';
import Window from '../Window.js';
import { e } from '../../lib/html.js';
export class AdjustTradeRates extends Action {
    constructor() {
        super(...arguments);
        _AdjustTradeRates_sliderGroup.set(this, void 0);
    }
    activate() {
        const sliders = [];
        const window = new Window('Adjust trade rates', e('div', ...this.value().all.map((tradeRate) => {
            const slider = new LockedSlider(tradeRate._, tradeRate.value * 100);
            sliders.push(slider);
            return slider.element();
        })));
        window.element().addEventListener('close', () => {
            transport.send('action', {
                name: 'AdjustTradeRates',
                id: this.value().id,
                value: __classPrivateFieldGet(this, _AdjustTradeRates_sliderGroup, "f").sliders().map((slider) => [
                    slider.label(),
                    slider.value() / 100,
                ]),
            });
        });
        __classPrivateFieldSet(this, _AdjustTradeRates_sliderGroup, new LockedSliderGroup(...sliders), "f");
    }
    build() {
        this.element().append(e('button.adjustTradeRates[title="Adjust trade rates"]'));
    }
    value() {
        return super.value();
    }
}
_AdjustTradeRates_sliderGroup = new WeakMap();
export default AdjustTradeRates;
//# sourceMappingURL=AdjustTradeRates.js.map