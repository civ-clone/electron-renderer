import { Yield } from '../types';
import Element from './Element.js';
export declare class GameDetails extends Element {
  #private;
  constructor(element: HTMLElement, turn: Yield, year: Yield);
  build(): void;
  year(year?: number): string;
}
export default GameDetails;
