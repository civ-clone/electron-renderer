import { CityBuild, PlayerAction, PlayerResearch, Unit } from '../../types';
import { a, e } from '../../lib/html.js';

export interface IAction {
  build(): void;
  complete(): void;
  element(): HTMLElement;
  value(): CityBuild | PlayerResearch | Unit;
}

export class Action implements IAction {
  #action: PlayerAction;
  #element: HTMLElement;

  constructor(action: PlayerAction) {
    this.#action = action;
    this.#element = a(e('div'), {
      class: 'action',
    });

    this.build();
  }

  build(): void {}

  complete(): void {
    const event = new CustomEvent('actioned', {
      bubbles: true,
      detail: this,
    });

    this.#element.dispatchEvent(event);
  }

  element(): HTMLElement {
    return this.#element;
  }

  value(): CityBuild | PlayerResearch | Unit {
    return this.#action.value;
  }
}

export default Action;
