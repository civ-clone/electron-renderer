import { e } from '../lib/html.js';

export interface IElement {
  build(): void;
  clear(): void;
  element(): HTMLElement;
}

export class Element implements IElement {
  #element: HTMLElement;

  constructor(element: HTMLElement = e('div')) {
    this.#element = element;
  }

  build(): void {}

  clear(): void {
    while (this.#element.firstChild !== null) {
      this.#element.firstChild.remove();
    }
  }

  element(): HTMLElement {
    return this.#element;
  }
}

export default Element;
