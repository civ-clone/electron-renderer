import { Unit } from '../types';
import { e, t } from '../lib/html.js';

export class UnitDetails {
  #activeUnit: Unit | null;
  #element: HTMLElement;

  constructor(element: HTMLElement, activeUnit: Unit | null) {
    this.#element = element;
    this.#activeUnit = activeUnit;
  }

  build(): void {
    while (this.#element.firstChild !== null) {
      this.#element.firstChild.remove();
    }

    if (this.#activeUnit === null) {
      return;
    }

    this.#element.append(
      e(
        'p',
        t(
          `${this.#activeUnit.player.civilization._} ${this.#activeUnit._} (${
            this.#activeUnit.tile.x
          }, ${this.#activeUnit.tile.y})`
        )
      ),
      e(
        'p',
        t(
          `${this.#activeUnit.moves.value} / ${
            this.#activeUnit.movement.value
          } moves`
        )
      ),
      e(
        'p',
        t(
          `A: ${this.#activeUnit.attack.value} / D: ${
            this.#activeUnit.defence.value
          } / V: ${this.#activeUnit.visibility.value}`
        )
      ),
      e(
        'p',
        t(
          `${this.#activeUnit.improvements
            .map((improvement) => improvement._)
            .join(', ')}`
        )
      )
    );
  }

  element(): HTMLElement {
    return this.#element;
  }
}
