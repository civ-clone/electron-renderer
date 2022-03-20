import Action from './Action.js';
import { e } from '../../lib/html.js';
import SelectionWindow from '../SelectionWindow.js';
export class Revolution extends Action {
    activate() {
        const chooseWindow = new SelectionWindow('Choose government', this.value().available.map((government) => ({
            value: government._,
        })), (selection) => {
            if (!selection) {
                return;
            }
            transport.send('action', {
                name: 'Revolution',
                id: this.value().id,
                chosen: selection ? selection : '@',
            });
            this.complete();
            chooseWindow.close();
        }, 'Which government would you like to convert to?', {
            displayAll: true,
        });
    }
    build() {
        this.element().append(e('button.chooseGovernment[title="Choose government"]'));
    }
    value() {
        return super.value();
    }
}
export default Revolution;
//# sourceMappingURL=Revolution.js.map