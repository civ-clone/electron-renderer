import { a, e } from '../lib/html.js';
import { PlayerAction } from '../types';
import Action from './Actions/Action.js';
import ChooseResearch from './Actions/ChooseResearch.js';
import CityBuild from './Actions/CityBuild.js';

export interface IActions {
  build(): void;
  element(): HTMLElement;
}

export class Actions implements IActions {
  #actions: Action[] = [];
  #element: HTMLElement;

  constructor(
    actions: PlayerAction[],
    container: HTMLElement = a(e('div'), {
      class: 'actions',
    })
  ) {
    this.#element = container;

    while (container.firstChild !== null) {
      container.firstChild.remove();
    }

    actions.forEach((action) => {
      let actionInstance: Action;

      switch (action._) {
        case 'ChooseResearch':
          actionInstance = new ChooseResearch(action);

          break;

        case 'CityBuild':
          actionInstance = new CityBuild(action);

          break;

        case 'ActiveUnit':
        // This is handled separately so no need to worry.
        default:
          console.log('need to handle ' + action._);
          return;
        // throw new TypeError(`Unknown action type '${action._}'.`);
      }

      this.#actions.push(actionInstance);
    });

    this.#element.addEventListener('actioned', (event) => {
      this.#actions.splice(
        this.#actions.indexOf((event as CustomEvent).detail),
        1
      );

      ((event as CustomEvent).detail as Action).element().remove();

      this.build();
    });

    this.build();
  }

  build(): void {
    this.#actions.forEach((action) => {
      this.#element.prepend(action.element());
    });
  }

  element(): HTMLElement {
    return this.#element;
  }
}

export default Actions;
