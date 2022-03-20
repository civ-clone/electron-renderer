import Element from './Element.js';
export declare type onInputHandler = () => void;
export declare class LockedSlider extends Element {
  #private;
  constructor(label: string, currentValue: number);
  build(): void;
  label(): string;
  private lock;
  onInput(handler: onInputHandler): void;
  isLocked(): boolean;
  set(value: string): void;
  value(): number;
}
export default LockedSlider;
