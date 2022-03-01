import { e } from '../../lib/html.js';
import Action from './Action.js';
import { ITransport } from '../../types';

declare var transport: ITransport;

export class EndTurn extends Action {
  activate(): void {
    transport.send('action', {
      name: 'EndTurn',
    });
  }

  build(): void {
    this.element().append(
      e(
        `button.endTurn[title="End turn"]`,
        e(
          'img[src="../../node_modules/feather-icons/dist/icons/check-circle.svg"][alt="End turn"]'
        )
      )
    );
  }
}

export default EndTurn;
