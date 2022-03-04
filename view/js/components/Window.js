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
var _Window_body, _Window_title;
import { e, h, t } from '../lib/html.js';
import TransientElement from './TransientElement.js';
const defaultOptions = {
    autoDisplay: true,
    canClose: true,
    canMaximise: false,
    canResize: false,
    parent: document.body,
    position: 'auto',
    size: 'auto',
};
export class Window extends TransientElement {
    constructor(title, body, options = {}) {
        var _a;
        super((_a = options.parent) !== null && _a !== void 0 ? _a : defaultOptions.parent, e('div.window'));
        _Window_body.set(this, void 0);
        _Window_title.set(this, void 0);
        this.options = {
            ...defaultOptions,
            ...options,
        };
        __classPrivateFieldSet(this, _Window_body, body, "f");
        __classPrivateFieldSet(this, _Window_title, title, "f");
        if (this.options.size === 'auto') {
            this.element().classList.add('size-auto');
        }
        if (this.options.size === 'maximised') {
            this.element().classList.add('maximised');
        }
        if (this.options.size !== 'auto') {
            ['height', 'width'].forEach((dimension) => {
                const value = this.options.size[dimension];
                if (typeof value === 'number') {
                    this.element().style[dimension] = value + 'px';
                    return;
                }
                this.element().style[dimension] = value;
            });
        }
        if (this.options.position === 'auto') {
            this.element().classList.add('position-auto');
        }
        if (this.options.position !== 'auto') {
            [
                ['x', 'left'],
                ['y', 'top'],
            ].forEach(([axis, property]) => {
                this.element().style[property] =
                    Math.min(0, Math.max(document.body.clientHeight - 20, this.options.position[axis])) + 'px';
            });
        }
        if (this.options.autoDisplay) {
            this.display();
        }
    }
    build() {
        this.empty();
        const headerActions = [
            [
                this.options.canMaximise,
                h(e('button.maximise[aria-label="Maximise"]', t('Maximise'), e('img.maximise[src="../../node_modules/feather-icons/dist/icons/maximize.svg"][alt="Maximise"]'), e('img.restore[src="../../node_modules/feather-icons/dist/icons/minimize.svg"][alt="Restore"]')), {
                    click: () => this.maximise(),
                }),
            ],
            [
                this.options.canClose,
                h(e('button.close[aria-label="Close"]', t('Close'), e('img[src="../../node_modules/feather-icons/dist/icons/x.svg"][alt="Close"]')), {
                    click: () => this.close(),
                }),
            ],
        ]
            .filter(([show]) => show)
            .map(([, element]) => element);
        this.element().append(h(e('header', e('h3', t(__classPrivateFieldGet(this, _Window_title, "f"))), ...headerActions), {
            dblclick: () => this.maximise(),
        }), e('div.body', __classPrivateFieldGet(this, _Window_body, "f") instanceof Node ? __classPrivateFieldGet(this, _Window_body, "f") : e('p', t(__classPrivateFieldGet(this, _Window_body, "f")))));
        this.element().addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.options.canClose) {
                this.close();
            }
            // Capture all keypresses whilst this is focused
            event.stopPropagation();
        });
    }
    close() {
        this.element().remove();
        this.element().dispatchEvent(new CustomEvent('close'));
    }
    display(focus = true) {
        super.display();
        if (!focus) {
            return;
        }
        this.element().focus();
    }
    maximise() {
        if (!this.options.canMaximise) {
            return;
        }
        this.element().classList.toggle('maximised');
    }
    update(content) {
        this.element().lastElementChild.remove();
        this.element().append(content instanceof Node ? content : e('p', t(content)));
    }
}
_Window_body = new WeakMap(), _Window_title = new WeakMap();
export default Window;
//# sourceMappingURL=Window.js.map