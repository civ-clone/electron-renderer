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
var _Notifications_container, _Notifications_notifications;
import NotificationWindow from './NotificationWindow.js';
export class Notifications {
    constructor(container = document.body) {
        _Notifications_container.set(this, void 0);
        _Notifications_notifications.set(this, []);
        __classPrivateFieldSet(this, _Notifications_container, container, "f");
    }
    receive(notification) {
        __classPrivateFieldGet(this, _Notifications_notifications, "f").push(notification);
        this.check();
    }
    check() {
        const active = document.querySelector('.notificationWindow');
        if (!__classPrivateFieldGet(this, _Notifications_notifications, "f").length || active) {
            return;
        }
        const notification = __classPrivateFieldGet(this, _Notifications_notifications, "f").shift();
        this.publish(notification);
    }
    publish(notification) {
        var _a;
        const notificationWindow = new NotificationWindow((_a = notification.title) !== null && _a !== void 0 ? _a : 'Notification', notification.message, {
            parent: __classPrivateFieldGet(this, _Notifications_container, "f"),
        });
        notificationWindow.element().addEventListener('close', () => this.check());
    }
}
_Notifications_container = new WeakMap(), _Notifications_notifications = new WeakMap();
export default Notifications;
//# sourceMappingURL=Notifications.js.map