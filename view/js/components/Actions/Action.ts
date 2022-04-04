import {
  CityBuild,
  PlayerAction,
  PlayerGovernment,
  PlayerResearch,
  PlayerTradeRates,
  Unit,
} from '../../types';
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
  value():
    | CityBuild
    | PlayerResearch
    | Unit
    | PlayerGovernment
    | PlayerTradeRates;
}

export class Action implements IAction {
  #action: PlayerAction;
  #element: HTMLElement;

  constructor(action: PlayerAction) {
    this.#action = action;
    this.#element = e('div.action');

    this.#element.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        return;
      }

      event.stopPropagation();
    });

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

  value():
    | CityBuild
    | PlayerResearch
    | Unit
    | PlayerGovernment
    | PlayerTradeRates {
    return this.#action.value;
  }
}

export default Action;
