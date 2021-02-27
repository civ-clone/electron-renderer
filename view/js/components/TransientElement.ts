import { e } from '../lib/html.js';
import { Element, IElement } from './Element.js';

export interface ITransientElement extends IElement {
  display(): void;
  parent(): HTMLElement;
}

export class TransientElement extends Element implements ITransientElement {
  #parent: HTMLElement;

  constructor(parent: HTMLElement, element: HTMLElement = e('div')) {
    super(element);

    this.#parent = parent;
  }

  display(): void {
    this.build();

    this.#parent.append(this.element());
  }

  parent(): HTMLElement {
    return this.#parent;
  }
}

export default TransientElement;
