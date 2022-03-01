export interface IElement {
  build(...args: any[]): void;
  element(): HTMLElement;
}
export declare class Element implements IElement {
  #private;
  constructor(element?: HTMLElement);
  build(...args: any[]): void;
  element(): HTMLElement;
  protected empty(): void;
}
export default Element;
