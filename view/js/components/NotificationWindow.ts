import { e, h, t } from '../lib/html.js';
import TransientElement, { ITransientElement } from './TransientElement.js';

export interface INotificationWindow extends ITransientElement {}

export class NotificationWindow
  extends TransientElement
  implements INotificationWindow {
  #body: string | Node;
  #title: string;

  constructor(
    title: string,
    body: string | Node,
    parent: HTMLElement = document.body
  ) {
    super(parent, e('div.notificationWindow'));

    this.#body = body;
    this.#title = title;
  }

  build(): void {
    this.element().append(
      e(
        'header',
        e(
          'h3',
          t(this.#title),
          h(e('button.close', t('Close')), {
            click: () => this.close(),
          })
        )
      ),
      this.#body instanceof Node ? this.#body : e('p', t(this.#body))
    );
  }

  close(): void {
    this.element().remove();

    this.element().dispatchEvent(new CustomEvent('close'));
  }
}

export default NotificationWindow;
