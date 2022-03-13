var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SelectionWindow_selectionList;
import { e, h, t } from '../lib/html.js';
import { NotificationWindow, } from './NotificationWindow.js';
export class SelectionWindow extends NotificationWindow {
    constructor(title, optionList, onChoose, body = 'Please choose one of the following:', options = {}) {
        options = {
            autoFocus: true,
            displayAll: false,
            ...options,
            actions: {
                primary: {
                    label: 'OK',
                    action: (selectionWindow) => chooseHandler(selectionWindow.selectionList().value),
                },
                ...options.actions,
            },
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
            dblclick: () => chooseHandler(selectionList.value),
        });
        if (options.displayAll && optionList.length > 1) {
            selectionList.setAttribute('size', optionList.length.toString());
        }
        if (options.autoFocus) {
            selectionList.setAttribute('autofocus', '');
        }
        super(title, e('div', ...(body instanceof Node
            ? [body]
            : body === null
                ? []
                : [e('p', t(body))]), selectionList, e('footer', ...Object.entries(options.actions).map(([, { label, action }]) => h(e('button', t(label)), {
            click: () => action(this),
            keydown: (event) => {
                if (event.key === 'Enter') {
                    action(this);
                }
            },
        })))));
        _SelectionWindow_selectionList.set(this, void 0);
        this.element().classList.add('selectionWindow');
        __classPrivateFieldSet(this, _SelectionWindow_selectionList, selectionList, "f");
    }
    display() {
        return super.display(false).then(() => {
            const select = this.element().querySelector('select');
            if (select && select.hasAttribute('autofocus')) {
                select.focus();
            }
        });
    }
    selectionList() {
        return __classPrivateFieldGet(this, _SelectionWindow_selectionList, "f");
    }
}
_SelectionWindow_selectionList = new WeakMap();
export default SelectionWindow;
//# sourceMappingURL=SelectionWindow.js.map