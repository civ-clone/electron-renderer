import { e } from '../../lib/html.js';
import Action from './Action.js';
export class EndTurn extends Action {
    activate() {
        transport.send('action', {
            name: 'EndTurn',
        });
    }
    build() {
        this.element().append(e(`button.endTurn[title="End turn"]`));
    }
}
export default EndTurn;
//# sourceMappingURL=EndTurn.js.map