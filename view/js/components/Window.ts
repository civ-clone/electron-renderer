import { e, h, t } from '../lib/html.js';
import TransientElement, { ITransientElement } from './TransientElement.js';

export interface IWindow extends ITransientElement {
  close(): void;
  maximise(): void;
}

type WindowSize = {
  height: number | string;
  width: number | string;
};

type WindowPosition = {
  x: number;
  y: number;
};

export type WindowSettings = {
  canClose: boolean;
  canMaximise: boolean;
  canResize: boolean;
  parent: HTMLElement;
  position: WindowPosition | 'auto';
  size: WindowSize | 'auto' | 'maximised';
};

export type WindowOptions = { [K in keyof WindowSettings]?: WindowSettings[K] };

const defaultOptions: WindowSettings = {
  canClose: true,
  canMaximise: false,
  canResize: false,
  parent: document.body,
  position: 'auto',
  size: 'auto',
};

export class Window extends TransientElement implements IWindow {
  private options: WindowSettings;
  #body: string | Node;
  #title: string;

  constructor(title: string, body: string | Node, options: WindowOptions = {}) {
    super(options.parent ?? defaultOptions.parent, e('div.window'));

    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.#body = body;
    this.#title = title;

    if (this.options.size === 'auto') {
      this.element().classList.add('size-auto');
    }

    if (this.options.size === 'maximised') {
      this.element().classList.add('maximised');
    }

    if (this.options.size !== 'auto') {
      (['height', 'width'] as ('height' | 'width')[]).forEach((dimension) => {
        const value = (this.options.size as WindowSize)[dimension];

        if (typeof value === 'number') {
          this.element().style[dimension] = value + 'px';

          return;
        }

        this.element().style[dimension] = value;
      });
    }

    if (this.options.position === 'auto') {
      this.element().classList.add('position-auto');
    }

    if (this.options.position !== 'auto') {
      (
        [
          ['x', 'left'],
          ['y', 'top'],
        ] as ['x' | 'y', 'left' | 'top'][]
      ).forEach(([axis, property]) => {
        this.element().style[property] =
          Math.min(
            0,
            Math.max(
              document.body.clientHeight - 20,
              (this.options.position as WindowPosition)[axis]
            )
          ) + 'px';
      });
    }

    this.display();
  }

  public build(): void {
    this.empty();

    const headerActions: HTMLElement[] = (
      [
        [
          this.options.canMaximise,
          h(
            e(
              'button.maximise[aria-label="Maximise"]',
              t('Maximise'),
              e(
                'img.maximise[src="../../node_modules/feather-icons/dist/icons/maximize.svg"][alt="Maximise"]'
              ),
              e(
                'img.restore[src="../../node_modules/feather-icons/dist/icons/minimize.svg"][alt="Restore"]'
              )
            ),
            {
              click: () => this.maximise(),
            }
          ),
        ],
        [
          this.options.canClose,
          h(
            e(
              'button.close[aria-label="Close"]',
              t('Close'),
              e(
                'img[src="../../node_modules/feather-icons/dist/icons/x.svg"][alt="Close"]'
              )
            ),
            {
              click: () => this.close(),
            }
          ),
        ],
      ] as [boolean, HTMLElement][]
    )
      .filter(([show]: [boolean, HTMLElement]) => show)
      .map(([, element]) => element);

    this.element().append(
      h(e('header', e('h3', t(this.#title)), ...headerActions), {
        dblclick: () => this.maximise(),
      }),
      e(
        'div.body',
        this.#body instanceof Node ? this.#body : e('p', t(this.#body))
      )
    );

    this.element().addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.close();
      }

      // Capture all keypresses whilst this is focused
      event.stopPropagation();
    });
  }

  public close(): void {
    this.element().remove();

    this.element().dispatchEvent(new CustomEvent('close'));
  }

  public display(focus = true): void {
    super.display();

    if (!focus) {
      return;
    }

    this.element().focus();
  }

  public maximise(): void {
    if (!this.options.canMaximise) {
      return;
    }

    this.element().classList.toggle('maximised');
  }

  public update(content: string | Node): void {
    this.element().lastElementChild!.remove();

    this.element().append(
      content instanceof Node ? content : e('p', t(content))
    );
  }
}

export default Window;
