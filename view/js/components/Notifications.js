var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _container, _notifications;
import { a, e, t } from '../lib/html.js';
export class Notifications {
    constructor(container = document.body) {
        _container.set(this, void 0);
        _notifications.set(this, []);
        __classPrivateFieldSet(this, _container, container);
        this.bindEvents();
    }
    bindEvents() {
        window.setInterval(() => {
            const active = document.querySelector('.notificationWindow');
            if (!__classPrivateFieldGet(this, _notifications).length || active) {
                return;
            }
            const notification = __classPrivateFieldGet(this, _notifications).shift();
            this.publish(notification);
        }, 500);
    }
    receive(notification) {
        __classPrivateFieldGet(this, _notifications).push(notification);
    }
    publish(notification) {
        document.body.append(a(e('div', e('header', e('h3', t('Notification'))), e('p', t(notification.message)), a(e('button', t('Close')), {
            'data-action': 'close',
        })), {
            class: 'notificationWindow',
        }));
    }
}
_container = new WeakMap(), _notifications = new WeakMap();
export default Notifications;
//# sourceMappingURL=Notifications.js.map