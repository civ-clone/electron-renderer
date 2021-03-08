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

    // capture keys in the notification window
    this.element().addEventListener('keydown', (event: KeyboardEvent) => {
      event.stopPropagation();
    });

    this.element().setAttribute('tabindex', '0');

    this.#parent = parent;
  }

  display(): void {
    this.build();

    this.#parent.append(this.element());

    this.element().focus();
  }

  parent(): HTMLElement {
    return this.#parent;
  }
}

export default TransientElement;
