import { e, t } from '../lib/html.js';
import { Player } from '../types';
import Element from './Element.js';

export class PlayerDetails extends Element {
  #player: Player;

  constructor(element: HTMLElement, player: Player) {
    super(element);

    this.#player = player;
  }

  build(): void {
    this.empty();

    const { civilization, treasury, research } = this.#player;

    this.element().append(
      e('h3', t(`${civilization.leader.name} of the ${civilization._} empire`)),
      e(
        'p',
        t(
          `Researching ${
            research.researching
              ? `${research.researching._} (${research.progress.value}/${research.cost.value})`
              : 'nothing'
          }`
        )
      ),
      e('p', t(`Treasury ${treasury.value}`))
    );
  }
}

export default PlayerDetails;
