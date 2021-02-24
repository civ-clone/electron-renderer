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
var _element, _parent;
import { a, e, h, t } from '../lib/html.js';
export class NotificationWindow {
    constructor(title, body, parent = document.body) {
        _element.set(this, void 0);
        _parent.set(this, void 0);
        __classPrivateFieldSet(this, _element, a(e('div', e('header', e('h3', t(title), h(a(e('button', t('Close')), {
            class: 'close',
        }), {
            click: () => this.close(),
        }))), body instanceof Node ? body : e('p', t(body))), {
            class: 'notificationWindow',
        }));
        __classPrivateFieldSet(this, _parent, parent);
    }
    close() {
        this.element().remove();
    }
    display() {
        __classPrivateFieldGet(this, _parent).append(this.element());
    }
    element() {
        return __classPrivateFieldGet(this, _element);
    }
}
_element = new WeakMap(), _parent = new WeakMap();
export default NotificationWindow;
//# sourceMappingURL=NotificationWindow.js.map