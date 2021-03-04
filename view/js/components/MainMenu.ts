import { e, h, t } from '../lib/html.js';
import Element from './Element.js';
import { ITransport } from '../types';

declare var transport: ITransport;

export class MainMenu extends Element {
  constructor(element: HTMLElement) {
    super(element);

    this.build();

    const backgroundImage = document.querySelector(
      '#preload img[src$="main-menu-bg.jpg"]'
    ) as HTMLImageElement;

    if (backgroundImage.loading) {
      backgroundImage.addEventListener('load', () => {
        element.classList.add('active');
      });
    } else {
      element.classList.add('active');
    }
  }

  build() {
    this.element().append(
      e(
        'nav',
        h(e('button', t('Start a New Game')), {
          click: () => {
            this.remove();

            transport.send('start');
          },
        }),
        h(e('button', t('Customise World')), {
          click: () => {
            // TODO: show options panel
          },
        }),
        h(e('button', t('Quit')), {
          click: () => {
            this.remove();

            transport.send('quit');
          },
        })
      )
    );
  }

  remove(): void {
    this.element()
      .querySelectorAll('button')
      .forEach((button): void => button.setAttribute('disabled', ''));

    this.element().classList.remove('active');

    setTimeout((): void => {
      this.element().remove();
    }, 2000);
  }
}

export default MainMenu;
