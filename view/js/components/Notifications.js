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
import NotificationWindow from './NotificationWindow.js';
export class Notifications {
    constructor(container = document.body) {
        _container.set(this, void 0);
        _notifications.set(this, []);
        __classPrivateFieldSet(this, _container, container);
    }
    receive(notification) {
        __classPrivateFieldGet(this, _notifications).push(notification);
        this.check();
    }
    check() {
        const active = document.querySelector('.notificationWindow');
        if (!__classPrivateFieldGet(this, _notifications).length || active) {
            return;
        }
        const notification = __classPrivateFieldGet(this, _notifications).shift();
        this.publish(notification);
    }
    publish(notification) {
        var _a;
        const notificationWindow = new NotificationWindow((_a = notification.title) !== null && _a !== void 0 ? _a : 'Notification', notification.message, __classPrivateFieldGet(this, _container));
        notificationWindow.element().addEventListener('close', () => this.check());
        notificationWindow.display();
    }
}
_container = new WeakMap(), _notifications = new WeakMap();
export default Notifications;
//# sourceMappingURL=Notifications.js.map