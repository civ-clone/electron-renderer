import { Window, IWindow, WindowOptions } from './Window.js';

export interface INotificationWindow extends IWindow {}

const notificationQueue: [
  NotificationWindow,
  boolean,
  (...args: any[]) => void
][] = [];

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

  close(): void {
    super.close();

    if (notificationQueue.length) {
      const [notification, focus, resolve] = notificationQueue.shift()!;

      notification.display(focus);

      resolve();
    }
  }

  display(focus = true): Promise<void> {
    return new Promise((resolve) => {
      if (document.querySelector('div.notificationWindow')) {
        notificationQueue.push([this, focus, resolve]);

        return;
      }

      super.display();

      if (!focus) {
        resolve();

        return;
      }

      this.element().focus();

      resolve();
    });
  }
}

export default NotificationWindow;
