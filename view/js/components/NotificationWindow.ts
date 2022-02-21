import { Window, IWindow, WindowOptions } from './Window.js';

export interface INotificationWindow extends IWindow {}

const notificationQueue: NotificationWindow[] = [];

export class NotificationWindow extends Window implements INotificationWindow {
  constructor(title: string, body: string | Node, options: WindowOptions = {}) {
    super(title, body, options);

    this.element().classList.add('notificationWindow');

    this.element().addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.close();

        event.stopPropagation();
      }
    });
  }

  display(focus = true): void {
    if (document.querySelector('div.notificationWindow')) {
      notificationQueue.push(this);

      return;
    }

    super.display();

    if (!focus) {
      return;
    }

    this.element().focus();
  }
}

export default NotificationWindow;
