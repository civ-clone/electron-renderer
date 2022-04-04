import {
  NotificationWindow,
  NotificationWindowOptions,
} from './NotificationWindow.js';
export interface SelectionWindowOption {
  label?: string;
  value: any;
}
export interface SelectionWindowAction {
  label: string;
  action: (select: SelectionWindow) => void;
}
export interface SelectionWindowActions {
  [key: string]: SelectionWindowAction;
}
export interface SelectionWindowOptions extends NotificationWindowOptions {
  actions?: SelectionWindowActions;
  autoFocus?: boolean;
  displayAll?: boolean;
}
export declare class SelectionWindow extends NotificationWindow {
  #private;
  constructor(
    title: string,
    optionList: SelectionWindowOption[],
    onChoose: (selection: string) => void,
    body?: string | Node | null,
    options?: SelectionWindowOptions
  );
  close(): void;
  display(): Promise<any>;
  resize(): void;
  selectionList(): HTMLSelectElement;
}
export default SelectionWindow;
