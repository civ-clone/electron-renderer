import { e } from '../lib/html.js';

export interface IElement {
  build(): void;
  element(): HTMLElement;
}

export class Element implements IElement {
  #element: HTMLElement;

  constructor(element: HTMLElement = e('div')) {
    this.#element = element;
  }

  build(): void {}

  element(): HTMLElement {
    return this.#element;
  }

  protected empty(): void {
    while (this.#element.firstChild !== null) {
      this.#element.firstChild.remove();
    }
  }
}

export default Element;
