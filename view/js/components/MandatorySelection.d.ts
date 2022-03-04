import {
  SelectionWindow,
  SelectionWindowOption,
  SelectionWindowOptions,
} from './SelectionWindow.js';
declare global {
  interface GlobalEventHandlersEventMap {
    selection: CustomEvent<string>;
  }
}
export declare class MandatorySelection extends SelectionWindow {
  constructor(
    title: string,
    optionList: SelectionWindowOption[],
    onChoose: (selection: string) => void,
    body?: string | Node | null,
    options?: SelectionWindowOptions
  );
  display(): Promise<string>;
}
export default MandatorySelection;
