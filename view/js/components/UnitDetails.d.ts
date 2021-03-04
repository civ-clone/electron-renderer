import { Unit } from '../types';
import Element from './Element.js';
export declare class UnitDetails extends Element {
  #private;
  constructor(element: HTMLElement, activeUnit: Unit | null);
  build(): void;
}
export default UnitDetails;
