import { Element, IElement } from './Element.js';
import Action from './Actions/Action.js';
import { PlayerAction } from '../types';
declare global {
  interface GlobalEventHandlersEventMap {
    actioned: CustomEvent<Action>;
  }
}
export interface IActions extends IElement {
  build(actions: PlayerAction[]): void;
}
export declare class Actions extends Element implements IActions {
  constructor(container?: HTMLElement);
  build(actions: PlayerAction[]): void;
}
export default Actions;
