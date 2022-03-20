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
var _LockedSliderGroup_sliders;
export class LockedSliderGroup {
    constructor(...sliders) {
        _LockedSliderGroup_sliders.set(this, void 0);
        __classPrivateFieldSet(this, _LockedSliderGroup_sliders, sliders, "f");
        __classPrivateFieldGet(this, _LockedSliderGroup_sliders, "f").forEach((slider) => slider.onInput(() => {
            if (this.total() === 100) {
                return;
            }
            const otherSliders = __classPrivateFieldGet(this, _LockedSliderGroup_sliders, "f").filter((otherSlider) => otherSlider !== slider), otherActiveSliders = otherSliders.filter((slider) => !slider.isLocked());
            if (this.total() !== 100 && otherActiveSliders.length === 0) {
                slider.set((100 - this.total(otherSliders)).toString());
                return;
            }
            if (this.total() > 100) {
                let overage = this.total() - 100, chunk = Math.ceil(overage / otherActiveSliders.length);
                otherActiveSliders.forEach((otherSlider) => {
                    otherSlider.set((otherSlider.value() - Math.min(chunk, overage)).toString());
                    overage -= chunk;
                });
                if (this.total() > 100) {
                    slider.set((100 - this.total(otherSliders)).toString());
                }
            }
            if (this.total() < 100) {
                let remaining = 100 - this.total(), chunk = Math.ceil(remaining / otherActiveSliders.length);
                otherActiveSliders.forEach((otherSlider) => {
                    otherSlider.set((otherSlider.value() + Math.min(chunk, remaining)).toString());
                    remaining -= chunk;
                });
                if (this.total() < 100) {
                    slider.set((100 - this.total(otherSliders)).toString());
                }
            }
        }));
    }
    sliders() {
        return __classPrivateFieldGet(this, _LockedSliderGroup_sliders, "f");
    }
    total(sliders = __classPrivateFieldGet(this, _LockedSliderGroup_sliders, "f")) {
        return sliders.reduce((total, slider) => total + slider.value(), 0);
    }
}
_LockedSliderGroup_sliders = new WeakMap();
export default LockedSliderGroup;
//# sourceMappingURL=LockedSliderGroup.js.map