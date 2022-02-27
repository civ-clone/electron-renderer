import { Unit } from '../types';
import { e, t } from '../lib/html.js';
import Element from './Element.js';

export class UnitDetails extends Element {
  #activeUnit: Unit | null;

  constructor(element: HTMLElement, activeUnit: Unit | null) {
    super(element);

    this.#activeUnit = activeUnit;

    this.build();
  }

  build(): void {
    this.empty();

    if (this.#activeUnit === null) {
      return;
    }

    this.element().append(
      e(
        'p',
        t(
          `${this.#activeUnit._} (${this.#activeUnit.tile.x}, ${
            this.#activeUnit.tile.y
          })`
        )
      ),
      e('p', t(this.#activeUnit.city?.name ?? 'NONE')),
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
      ),
      e(
        'p',
        t(
          `${this.#activeUnit.tile.units
            .filter((unit) => unit !== this.#activeUnit)
            .map((unit) => unit._)
            .join(', ')}`
        )
      )
    );
  }
}

export default UnitDetails;
