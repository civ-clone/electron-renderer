import { Window, IWindow, WindowOptions } from './Window.js';
export interface INotificationWindow extends IWindow {}
export interface NotificationWindowOptions extends WindowOptions {
  queue?: boolean;
}
export declare class NotificationWindow
  extends Window
  implements INotificationWindow
{
  #private;
  constructor(
    title: string,
    body: string | Node,
    passedOptions?: NotificationWindowOptions
  );
  close(): void;
  display(focus?: boolean): Promise<any>;
  static hasOpenWindow(): boolean;
}
export default NotificationWindow;
