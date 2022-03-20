import LockedSlider from './LockedSlider.js';
export declare class LockedSliderGroup {
  #private;
  constructor(...sliders: LockedSlider[]);
  sliders(): LockedSlider[];
  private total;
}
export default LockedSliderGroup;
