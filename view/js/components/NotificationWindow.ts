import { a, e, h, t } from '../lib/html.js';

export interface INotificationWindow {
  display(): void;
  element(): HTMLElement;
}

export class NotificationWindow implements INotificationWindow {
  #element: HTMLElement;
  #parent: HTMLElement;

  constructor(
    title: string,
    body: string | Node,
    parent: HTMLElement = document.body
  ) {
    this.#element = a(
      e(
        'div',
        e(
          'header',
          e(
            'h3',
            t(title),
            h(
              a(e('button', t('Close')), {
                class: 'close',
              }),
              {
                click: () => this.close(),
              }
            )
          )
        ),
        body instanceof Node ? body : e('p', t(body))
      ),
      {
        class: 'notificationWindow',
      }
    );

    this.#parent = parent;
  }

  close(): void {
    this.element().remove();
  }

  display(): void {
    this.#parent.append(this.element());
  }

  element(): HTMLElement {
    return this.#element;
  }
}

export default NotificationWindow;
