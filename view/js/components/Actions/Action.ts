import { CityBuild, PlayerAction, PlayerResearch, Unit } from '../../types';
import { e } from '../../lib/html.js';

declare global {
  interface GlobalEventHandlersEventMap {
    actioned: CustomEvent<Action>;
  }
}

export interface IAction {
  activate(): void;
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
    this.#element = e('div.action');

    this.#element.addEventListener('keydown', (event) =>
      event.stopPropagation()
    );

    this.build();
  }

  public activate(): void {}

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
