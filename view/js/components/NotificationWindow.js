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
var _NotificationWindow_options;
import { Window } from './Window.js';
const notificationQueue = [];
export class NotificationWindow extends Window {
    constructor(title, body, passedOptions = {}) {
        const options = {
            queue: true,
            ...passedOptions,
        };
        super(title, body, options);
        _NotificationWindow_options.set(this, {});
        __classPrivateFieldSet(this, _NotificationWindow_options, options, "f");
        this.element().classList.add('notificationWindow');
        this.element().addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.close();
                event.stopPropagation();
            }
        });
    }
    close() {
        super.close();
        if (__classPrivateFieldGet(this, _NotificationWindow_options, "f").queue &&
            notificationQueue.length &&
            NotificationWindow.hasOpenWindow()) {
            const [notification, focus, resolve] = notificationQueue.shift();
            notification.display(focus);
            resolve();
        }
    }
    display(focus = true) {
        return new Promise((resolve) => {
            if (NotificationWindow.hasOpenWindow()) {
                notificationQueue.push([this, focus, resolve]);
                return;
            }
            super.display();
            if (!focus) {
                resolve(undefined);
                return;
            }
            this.element().focus();
            resolve(undefined);
        });
    }
    static hasOpenWindow() {
        return !!document.querySelector('div.notificationWindow');
    }
}
_NotificationWindow_options = new WeakMap();
export default NotificationWindow;
//# sourceMappingURL=NotificationWindow.js.map