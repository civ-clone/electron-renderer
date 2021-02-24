import NotificationWindow from './NotificationWindow.js';
export interface SelectionWindowAction {
    label: string;
    handler: (selection: string) => void;
}
export interface SelectionWindowOption {
    label?: string;
    value: any;
}
export declare class SelectionWindow extends NotificationWindow {
    constructor(title: string, options: SelectionWindowOption[], actions: SelectionWindowAction[], body?: string | Node);
}
export default SelectionWindow;
