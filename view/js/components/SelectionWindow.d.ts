import NotificationWindow from './NotificationWindow.js';
export interface SelectionWindowOption {
  label?: string;
  value: any;
}
export interface SelectionWindowOptions {
  chooseLabel?: string;
  displayAll?: boolean;
}
export declare class SelectionWindow extends NotificationWindow {
  constructor(
    title: string,
    optionList: SelectionWindowOption[],
    onChoose: (selection: string) => void,
    body?: string | Node | null,
    options?: SelectionWindowOptions
  );
  display(): void;
}
export default SelectionWindow;
