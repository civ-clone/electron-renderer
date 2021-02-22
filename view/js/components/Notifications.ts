import { a, e, h, t } from '../lib/html.js';

export interface Notification {
  message: string;
}

export class Notifications {
  #container: HTMLElement;
  #notifications: Notification[] = [];

  constructor(container: HTMLElement = document.body) {
    this.#container = container;
    this.bindEvents();
  }

  private bindEvents(): void {
    window.setInterval((): void => {
      const active = document.querySelector('.notificationWindow');

      if (!this.#notifications.length || active) {
        return;
      }

      const notification = this.#notifications.shift() as Notification;

      this.publish(notification);
    }, 500);
  }

  receive(notification: Notification): void {
    this.#notifications.push(notification);
  }

  publish(notification: Notification): void {
    document.body.append(
      a(
        e(
          'div',
          e('header', e('h3', t('Notification'))),
          e('p', t(notification.message)),
          a(e('button', t('Close')), {
            'data-action': 'close',
          })
        ),
        {
          class: 'notificationWindow',
        }
      )
    );
  }
}

export default Notifications;
