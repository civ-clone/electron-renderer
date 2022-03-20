import { Element, IElement } from './Element.js';
import Action from './Actions/Action.js';
import { PlayerAction } from '../types';
import Portal from './Portal.js';
declare global {
  interface GlobalEventHandlersEventMap {
    actioned: CustomEvent<Action>;
  }
}
export interface IActions extends IElement {
  build(mandatoryActions: PlayerAction[], actions: PlayerAction[]): void;
}
export declare class Actions extends Element implements IActions {
  #private;
  constructor(container: HTMLElement | undefined, portal: Portal);
  build(actions: PlayerAction[]): void;
}
export default Actions;
