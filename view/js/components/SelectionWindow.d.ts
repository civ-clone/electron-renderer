import NotificationWindow from './NotificationWindow.js';
import { WindowOptions } from './Window';
export interface SelectionWindowOption {
  label?: string;
  value: any;
}
export interface SelectionWindowOptions extends WindowOptions {
  autoFocus?: boolean;
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
  display(): Promise<any>;
}
export default SelectionWindow;
