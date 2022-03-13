import { NotificationWindow, } from './NotificationWindow.js';
import { e, h, t } from '../lib/html.js';
export class ConfirmationWindow extends NotificationWindow {
    constructor(title, details, onOK, options = {}) {
        var _a, _b;
        const confirmationButton = h(e('button', t((_a = options.okLabel) !== null && _a !== void 0 ? _a : 'OK')), {
            click: () => {
                onOK();
                this.close();
            },
            keydown: (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    onOK();
                    this.close();
                }
            },
        });
        super(title, e('div.content', e('p', t(details)), e('footer', confirmationButton, h(e('button', t((_b = options.cancelLabel) !== null && _b !== void 0 ? _b : 'Cancel')), {
            click: () => this.close(),
            keydown: (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    this.close();
                }
            },
        }))), {
            ...options,
            queue: false,
        });
        confirmationButton.focus();
    }
}
export default ConfirmationWindow;
//# sourceMappingURL=ConfirmationWindow.js.map