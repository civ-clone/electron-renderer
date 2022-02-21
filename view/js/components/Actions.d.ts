import { Element, IElement } from './Element.js';
import { PlayerAction } from '../types';
export interface IActions extends IElement {}
export declare class Actions extends Element implements IActions {
  #private;
  constructor(actions: PlayerAction[], container?: HTMLElement);
  build(): void;
}
export default Actions;
