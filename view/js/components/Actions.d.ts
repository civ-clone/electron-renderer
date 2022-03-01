import { Element, IElement } from './Element.js';
import { PlayerAction } from '../types';
export interface IActions extends IElement {
  build(actions: PlayerAction[]): void;
}
export declare class Actions extends Element implements IActions {
  constructor(container?: HTMLElement);
  build(actions: PlayerAction[]): void;
}
export default Actions;
