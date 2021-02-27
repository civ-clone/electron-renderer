export interface IElement {
    build(): void;
    clear(): void;
    element(): HTMLElement;
}
export declare class Element implements IElement {
    #private;
    constructor(element?: HTMLElement);
    build(): void;
    clear(): void;
    element(): HTMLElement;
}
export default Element;
