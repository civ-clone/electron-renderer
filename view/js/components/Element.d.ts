export interface IElement {
  build(): void;
  element(): HTMLElement;
}
export declare class Element implements IElement {
  #private;
  constructor(element?: HTMLElement);
  build(): void;
  element(): HTMLElement;
  protected empty(): void;
}
export default Element;
