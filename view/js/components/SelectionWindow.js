import { a, e, h, t } from '../lib/html.js';
import NotificationWindow from './NotificationWindow.js';
export class SelectionWindow extends NotificationWindow {
    constructor(title, options, actions, body = 'Please choose one of the following:') {
        const selectionList = e('select', ...options.map((option) => a(e('option', t(option.label || option.value)), {
            value: option.value,
        })));
        super(title, e('div', body instanceof Node ? body : e('p', t(body)), selectionList, e('footer', ...actions.map((action) => h(e('button', t(action.label)), {
            click: () => {
                action.handler(selectionList.value);
            },
        })))));
    }
}
export default SelectionWindow;
//# sourceMappingURL=SelectionWindow.js.map