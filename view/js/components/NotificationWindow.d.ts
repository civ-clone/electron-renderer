import { Window, IWindow, WindowOptions } from './Window.js';
export interface INotificationWindow extends IWindow {}
export declare class NotificationWindow
  extends Window
  implements INotificationWindow
{
  constructor(title: string, body: string | Node, options?: WindowOptions);
  display(focus?: boolean): void;
}
export default NotificationWindow;
