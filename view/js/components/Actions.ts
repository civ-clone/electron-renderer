import { Element, IElement } from './Element.js';
import { e, h } from '../lib/html.js';
import Action from './Actions/Action.js';
import ChooseResearch from './Actions/ChooseResearch.js';
import CityBuild from './Actions/CityBuild.js';
import EndTurn from './Actions/EndTurn.js';
import { PlayerAction } from '../types';

export interface IActions extends IElement {
  build(actions: PlayerAction[]): void;
}

export class Actions extends Element implements IActions {
  constructor(container: HTMLElement = e('div.actions')) {
    super(container);

    this.element().addEventListener('actioned', (event) =>
      (event as CustomEvent<Action>).detail.element().remove()
    );

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
  }

  build(actions: PlayerAction[]): void {
    this.empty();

    actions.forEach((playerAction) => {
      let action: Action;

      switch (playerAction._) {
        // This is handled separately so no need to worry.
        case 'ActiveUnit':
          return;

        case 'ChooseResearch':
          action = new ChooseResearch(playerAction);

          break;

        case 'CityBuild':
          action = new CityBuild(playerAction);

          break;

        case 'EndTurn':
          action = new EndTurn(playerAction);

          break;

        default:
          console.log('need to handle ' + playerAction._);
          return;
        // throw new TypeError(`Unknown action type '${action._}'.`);
      }

      this.element().prepend(
        h(action.element(), {
          click: () => action.activate(),
          keydown: ({ key }) => {
            if (key === ' ' || key === 'Enter') {
              action.activate();
            }
          },
        })
      );
    });
  }
}

export default Actions;
