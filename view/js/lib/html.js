export const t = (s) => document.createTextNode(s);
export const e = (t, ...nodes) => {
    const e = document.createElement(t);
    e.append(...nodes);
    return e;
};
export const a = (e, a) => {
    Object.entries(a).forEach(([k, v]) => e.setAttribute(k, v));
    return e;
};
export const h = (e, h) => {
    Object.entries(h).forEach(([n, h]) => e.addEventListener(n, h));
    return e;
};
//# sourceMappingURL=html.js.map