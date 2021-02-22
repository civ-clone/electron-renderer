export const t = (s: string) => document.createTextNode(s);
export const e = (t: string, ...nodes: Node[]) => {
  const e = document.createElement(t);

  e.append(...nodes);

  return e;
};
export const a = (e: HTMLElement, a: { [key: string]: string }) => {
  Object.entries(a).forEach(([k, v]) => e.setAttribute(k, v));

  return e;
};
export const h = (e: HTMLElement, h: { [key: string]: () => void }) => {
  Object.entries(h).forEach(([n, h]) => e.addEventListener(n, h));

  return e;
};
