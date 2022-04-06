import { e } from '../../lib/html';
import Action from './Action';
import { ITransport } from '../../types';

declare var transport: ITransport;

export class EndTurn extends Action {
  activate(): void {
    transport.send('action', {
      name: 'EndTurn',
    });
  }

  build(): void {
    this.element().append(e(`button.endTurn[title="End turn"]`));
  }
}

export default EndTurn;
