import { Element, IElement } from './Element.js';
import { e, h } from '../lib/html.js';
import Action from './Actions/Action.js';
import ChooseResearch from './Actions/ChooseResearch.js';
import CityBuild from './Actions/CityBuild.js';
import { PlayerAction } from '../types';

export interface IActions extends IElement {}

export class Actions extends Element implements IActions {
  #actions: Action[] = [];

  constructor(
    actions: PlayerAction[],
    container: HTMLElement = e('div.actions')
  ) {
    super(container);

    actions.forEach((action) => {
      let actionInstance: Action;

      switch (action._) {
        case 'ChooseResearch':
          actionInstance = new ChooseResearch(action);

          break;

        case 'CityBuild':
          actionInstance = new CityBuild(action);

          break;

        // This is handled separately so no need to worry.
        case 'ActiveUnit':
          return;

        default:
          console.log('need to handle ' + action._);
          return;
        // throw new TypeError(`Unknown action type '${action._}'.`);
      }

      this.#actions.push(actionInstance);
    });

    this.element().addEventListener('actioned', (event) => {
      this.#actions.splice(
        this.#actions.indexOf((event as CustomEvent).detail),
        1
      );

      ((event as CustomEvent).detail as Action).element().remove();

      this.build();
    });

    this.element().addEventListener('keydown', (event) => {
      const currentChild = document.activeElement;

      if (!currentChild?.matches('div.actions, div.actions *')) {
        return;
      }

      const { key } = event,
        children = Array.from(this.element().children) as HTMLElement[];

      if (children.length === 0) {
        return;
      }

      // TODO: scroll the actions container if the element isn't visible
      if (currentChild === this.element()) {
        event.preventDefault();
        event.stopPropagation();

        if (key === 'UpArrow') {
          (currentChild.lastElementChild as HTMLElement)?.focus();

          return;
        }

        if (key === 'DownArrow') {
          (currentChild.firstElementChild as HTMLElement)?.focus();

          return;
        }
      }

      event.preventDefault();
      event.stopPropagation();

      let currentAction =
        currentChild === this.element()
          ? (currentChild.lastElementChild as HTMLElement)
          : (currentChild as HTMLElement);

      while (currentAction.parentElement !== this.element()) {
        currentAction = currentAction.parentElement as HTMLElement;
      }

      const currentIndex = children.indexOf(currentAction);

      if (key === 'UpArrow') {
        if (currentIndex > 0) {
          children[currentIndex - 1].focus();

          return;
        }

        children.pop()!.focus();

        return;
      }

      if (key === 'DownArrow') {
        if (currentIndex > children.length - 1) {
          children.shift()!.focus();

          return;
        }

        children[currentIndex + 1]!.focus();

        return;
      }
    });

    this.build();
  }

  build(): void {
    this.empty();

    this.#actions.forEach((action) =>
      this.element().prepend(
        h(action.element(), {
          click: () => action.activate(),
          keydown: ({ key }) => {
            if (key === ' ' || key === 'Enter') {
              action.activate();
            }
          },
        })
      )
    );
  }
}

export default Actions;
