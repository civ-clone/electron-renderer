export const parseSelector = (selector) => {
    const classes = [], attributes = {}, strings = [];
    let element = 'div';
    const parts = selector
        .replace(/(?!<\\)(["']).+?(?!<\\)(\1)/g, (string) => 'string$' + (strings.push(string.slice(1, -1)) - 1))
        .split(/(?=[.#[])/);
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
                attributes[match[1]] = ((_a = match[4]) !== null && _a !== void 0 ? _a : '').replace(/string\$(\d+)/, (match, id) => strings[id]);
            }
            return;
        }
    });
    return [element, classes, attributes];
};
export const t = (string) => document.createTextNode(string);
export const e = (selector, ...nodes) => {
    const [element, classes, attributes] = parseSelector(selector), e = document.createElement(element);
    if (classes.length) {
        e.classList.add(...classes);
    }
    a(e, attributes);
    if (nodes.length) {
        e.append(...nodes);
    }
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