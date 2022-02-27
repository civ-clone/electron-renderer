import { e, h, t } from '../lib/html.js';
import NotificationWindow from './NotificationWindow.js';
export class SelectionWindow extends NotificationWindow {
    constructor(title, optionList, onChoose, body = 'Please choose one of the following:', options = {
        chooseLabel: 'OK',
        displayAll: false,
    }) {
        var _a;
        const chooseHandler = (selection) => {
            onChoose(selection);
            this.close();
        }, selectionList = h(e('select[autofocus]', ...optionList.map((option) => e(`option[value="${option.value}"]`, t(option.label || option.value)))), {
            keydown: (event) => {
                if (event.key === 'Enter') {
                    chooseHandler(selectionList.value);
                }
            },
            dblclick: () => {
                chooseHandler(selectionList.value);
            },
        });
        if (options.displayAll) {
            selectionList.setAttribute('size', optionList.length.toString());
        }
        super(title, e('div', ...(body instanceof Node
            ? [body]
            : body === null
                ? []
                : [e('p', t(body))]), selectionList, e('footer', h(e('button', t((_a = options.chooseLabel) !== null && _a !== void 0 ? _a : 'OK')), {
            click: () => chooseHandler(selectionList.value),
        }))));
        this.element().classList.add('selectionWindow');
    }
    display() {
        return super
            .display(false)
            .then(() => this.element().querySelector('select').focus());
    }
}
export default SelectionWindow;
//# sourceMappingURL=SelectionWindow.js.map