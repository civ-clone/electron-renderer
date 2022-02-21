import Action from './Action.js';
import { e } from '../../lib/html.js';
import SelectionWindow from '../SelectionWindow.js';
export class ChooseResearch extends Action {
    activate() {
        const chooseWindow = new SelectionWindow('Choose research', this.value().available.map((advance) => ({
            value: advance._,
        })), (selection) => {
            if (!selection) {
                return;
            }
            transport.send('action', {
                name: 'ChooseResearch',
                id: this.value().id,
                chosen: selection ? selection : '@',
            });
            this.complete();
            chooseWindow.close();
        }, 'Which advance would you like to research next?', {
            displayAll: true,
        });
    }
    build() {
        this.element().append(e('button.chooseResearch[title="Choose research"]'));
    }
    value() {
        return super.value();
    }
}
export default ChooseResearch;
//# sourceMappingURL=ChooseResearch.js.map