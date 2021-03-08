export const parseSelector = (
  selector: string
): [
  string,
  string[],
  {
    [key: string]: string;
  }
] => {
  let element = 'div',
    classes: string[] = [],
    attributes: {
      [key: string]: string;
    } = {};

  const parts = selector.split(/(?=[.#\[])/);

  parts.forEach((part) => {
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
        attributes[match[1]] = match[4] ?? '';
      }

      return;
    }
  });

  return [element, classes, attributes];
};

export const t = (string: string) => document.createTextNode(string);
export const e = (tagName: string, ...nodes: Node[]) => {
  const [element, classes, attributes] = parseSelector(tagName),
    e = document.createElement(element);

  e.classList.add(...classes);

  Object.entries(attributes).forEach(([key, value]) =>
    e.setAttribute(key, value)
  );

  e.append(...nodes);

  return e;
};
export const a = (
  element: HTMLElement,
  attributes: { [key: string]: string }
) => {
  Object.entries(attributes).forEach(([name, value]) =>
    element.setAttribute(name, value)
  );

  return element;
};
export const h = (
  element: HTMLElement,
  handlers: { [key: string]: (event: any) => void }
) => {
  Object.entries(handlers).forEach(([eventName, handler]): void =>
    element.addEventListener(eventName, handler)
  );

  return element;
};
