import {
  NotificationWindow,
  NotificationWindowOptions,
} from './NotificationWindow.js';
export interface ConfirmationWindowOptions extends NotificationWindowOptions {
  okLabel?: string;
  cancelLabel?: string;
}
export declare class ConfirmationWindow extends NotificationWindow {
  constructor(
    title: string,
    details: string,
    onOK: () => void,
    options?: ConfirmationWindowOptions
  );
}
export default ConfirmationWindow;
