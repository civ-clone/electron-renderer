import { SelectionWindow, } from './SelectionWindow.js';
export class MandatorySelection extends SelectionWindow {
    constructor(title, optionList, onChoose, body = 'Please choose one of the following:', options = {
        autoDisplay: false,
        chooseLabel: 'OK',
        canClose: false,
        displayAll: false,
    }) {
        super(title, optionList, onChoose, body, {
            ...options,
            autoDisplay: false,
            displayAll: true,
        });
    }
    display() {
        return new Promise((resolve) => {
            this.element().addEventListener('selection', ({ detail }) => resolve(detail));
            super.display();
        });
    }
}
export default MandatorySelection;
//# sourceMappingURL=MandatorySelection.js.map