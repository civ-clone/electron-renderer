import { e, t } from '../lib/html.js';
import { Yield } from '../types';
import Element from './Element.js';

export class GameDetails extends Element {
  #turn: Yield;
  #year: Yield;

  constructor(element: HTMLElement, turn: Yield, year: Yield) {
    super(element);

    this.#turn = turn;
    this.#year = year;
  }

  build(): void {
    this.clear();

    this.element().append(
      e(
        'h3',
        e('span#year', t(this.year())),
        e('span#turn', t(`(${this.#turn.value.toString()})`))
      )
    );
  }

  year(year = this.#year.value): string {
    if (year < 0) {
      return Math.abs(year) + ' BCE';
    }

    if (year === 0) {
      return '1 CE';
    }

    return year + ' CE';
  }
}

export default GameDetails;
