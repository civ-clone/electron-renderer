export const parseSelector = (selector) => {
    let element = 'div', classes = [], attributes = {};
    const parts = selector.split(/(?=[.#\[])/);
    parts.forEach((part) => {
        var _a;
        if (!part.match(/^[.#\[]/)) {
            element = part;
            return;
        }
        if (part[0] === '.') {
            classes.push(part.slice(1));
            return;
        }
        if (part[0] === '#') {
            attributes.id = part[0].slice(1);
            return;
        }
        if (part[0] === '[') {
            const match = part.match(/\[([^=]+)(=(["']?)(.+?)\3)?]/);
            if (match !== null) {
                attributes[match[1]] = (_a = match[4]) !== null && _a !== void 0 ? _a : '';
            }
            return;
        }
    });
    return [element, classes, attributes];
};
export const t = (string) => document.createTextNode(string);
export const e = (tagName, ...nodes) => {
    const [element, classes, attributes] = parseSelector(tagName), e = document.createElement(element);
    e.classList.add(...classes);
    Object.entries(attributes).forEach(([key, value]) => e.setAttribute(key, value));
    e.append(...nodes);
    return e;
};
export const a = (element, attributes) => {
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
    return element;
};
export const h = (element, handlers) => {
    Object.entries(handlers).forEach(([eventName, handler]) => element.addEventListener(eventName, handler));
    return element;
};
//# sourceMappingURL=html.js.map