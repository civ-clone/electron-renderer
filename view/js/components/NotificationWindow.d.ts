import { Window, IWindow, WindowOptions } from './Window.js';
export interface INotificationWindow extends IWindow {}
export declare class NotificationWindow
  extends Window
  implements INotificationWindow
{
  constructor(title: string, body: string | Node, options?: WindowOptions);
  close(): void;
  display(focus?: boolean): Promise<any>;
}
export default NotificationWindow;
