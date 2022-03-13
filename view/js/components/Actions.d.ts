import { Element, IElement } from './Element.js';
import Action from './Actions/Action.js';
import { PlayerAction } from '../types';
import Portal from './Portal';
declare global {
  interface GlobalEventHandlersEventMap {
    actioned: CustomEvent<Action>;
  }
}
export interface IActions extends IElement {
  build(actions: PlayerAction[], portal: Portal): void;
}
export declare class Actions extends Element implements IActions {
  #private;
  constructor(container: HTMLElement | undefined, portal: Portal);
  build(actions: PlayerAction[]): void;
}
export default Actions;
