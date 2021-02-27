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
var _body, _title;
import { e, h, t } from '../lib/html.js';
import TransientElement from './TransientElement.js';
export class NotificationWindow extends TransientElement {
    constructor(title, body, parent = document.body) {
        super(parent, e('div.notificationWindow'));
        _body.set(this, void 0);
        _title.set(this, void 0);
        __classPrivateFieldSet(this, _body, body);
        __classPrivateFieldSet(this, _title, title);
    }
    build() {
        this.element().append(e('header', e('h3', t(__classPrivateFieldGet(this, _title)), h(e('button.close', t('Close')), {
            click: () => this.close(),
        }))), __classPrivateFieldGet(this, _body) instanceof Node ? __classPrivateFieldGet(this, _body) : e('p', t(__classPrivateFieldGet(this, _body))));
    }
    close() {
        this.element().remove();
        this.element().dispatchEvent(new CustomEvent('close'));
    }
}
_body = new WeakMap(), _title = new WeakMap();
export default NotificationWindow;
//# sourceMappingURL=NotificationWindow.js.map