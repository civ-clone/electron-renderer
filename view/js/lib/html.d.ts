export declare const parseSelector: (selector: string) => [
  string,
  string[],
  {
    [key: string]: string;
  }
];
export declare const t: (string: string) => Text;
export declare const e: (selector: string, ...nodes: Node[]) => HTMLElement;
export declare const a: (
  element: HTMLElement,
  attributes: {
    [key: string]: string;
  }
) => HTMLElement;
export declare const h: <T extends HTMLElement>(
  element: T,
  handlers: {
    [key: string]: (event: any) => void;
  }
) => T;
