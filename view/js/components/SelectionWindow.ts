import { e, h, t } from '../lib/html.js';
import NotificationWindow from './NotificationWindow.js';
import { WindowOptions } from './Window';

export interface SelectionWindowOption {
  label?: string;
  value: any;
}

export interface SelectionWindowOptions extends WindowOptions {
  autoFocus?: boolean;
  chooseLabel?: string;
  displayAll?: boolean;
}

export class SelectionWindow extends NotificationWindow {
  constructor(
    title: string,
    optionList: SelectionWindowOption[],
    onChoose: (selection: string) => void,
    body: string | Node | null = 'Please choose one of the following:',
    options: SelectionWindowOptions = {}
  ) {
    options = {
      autoFocus: true,
      chooseLabel: 'OK',
      displayAll: false,
      ...options,
    };

    const chooseHandler = (selection: string): void => {
        this.element().dispatchEvent(
          new CustomEvent<string>('selection', {
            detail: selection,
          })
        );

        this.close();

        onChoose(selection);
      },
      selectionList = h(
        e(
          'select',
          ...optionList.map((option) =>
            e(
              `option[value="${option.value}"]`,
              t(option.label || option.value)
            )
          )
        ) as HTMLSelectElement,
        {
          keydown: (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
              chooseHandler(selectionList.value);
            }
          },
          dblclick: () => {
            chooseHandler(selectionList.value);
          },
        }
      );

    if (options.displayAll) {
      selectionList.setAttribute('size', optionList.length.toString());
    }

    if (options.autoFocus) {
      selectionList.setAttribute('autofocus', '');
    }

    super(
      title,
      e(
        'div',
        ...(body instanceof Node
          ? [body]
          : body === null
          ? []
          : [e('p', t(body))]),
        selectionList,
        e(
          'footer',
          h(e('button', t(options.chooseLabel ?? 'OK')), {
            click: () => chooseHandler(selectionList.value),
          })
        )
      )
    );

    this.element().classList.add('selectionWindow');
  }

  display(): Promise<any> {
    return super.display(false).then(() => {
      const select = this.element().querySelector('select');

      if (select!.hasAttribute('autofocus')) {
        select!.focus();
      }
    });
  }
}

export default SelectionWindow;
