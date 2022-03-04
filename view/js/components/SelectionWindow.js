import { e, h, t } from '../lib/html.js';
import NotificationWindow from './NotificationWindow.js';
export class SelectionWindow extends NotificationWindow {
    constructor(title, optionList, onChoose, body = 'Please choose one of the following:', options = {}) {
        var _a;
        options = {
            autoFocus: true,
            chooseLabel: 'OK',
            displayAll: false,
            ...options,
        };
        const chooseHandler = (selection) => {
            this.element().dispatchEvent(new CustomEvent('selection', {
                detail: selection,
            }));
            this.close();
            onChoose(selection);
        }, selectionList = h(e('select', ...optionList.map((option) => e(`option[value="${option.value}"]`, t(option.label || option.value)))), {
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
        if (options.autoFocus) {
            selectionList.setAttribute('autofocus', '');
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
        return super.display(false).then(() => {
            const select = this.element().querySelector('select');
            if (select.hasAttribute('autofocus')) {
                select.focus();
            }
        });
    }
}
export default SelectionWindow;
//# sourceMappingURL=SelectionWindow.js.map