import { Element, IElement } from './Element.js';
export interface ITransientElement extends IElement {
  display(): void;
  parent(): HTMLElement;
}
export declare class TransientElement
  extends Element
  implements ITransientElement
{
  #private;
  constructor(parent: HTMLElement, element?: HTMLElement);
  display(): void;
  parent(): HTMLElement;
}
export default TransientElement;
