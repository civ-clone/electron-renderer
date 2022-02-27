import { e, h, t } from '../lib/html.js';
import NotificationWindow from './NotificationWindow.js';

export interface SelectionWindowOption {
  label?: string;
  value: any;
}

export interface SelectionWindowOptions {
  chooseLabel?: string;
  displayAll?: boolean;
}

export class SelectionWindow extends NotificationWindow {
  constructor(
    title: string,
    optionList: SelectionWindowOption[],
    onChoose: (selection: string) => void,
    body: string | Node | null = 'Please choose one of the following:',
    options: SelectionWindowOptions = {
      chooseLabel: 'OK',
      displayAll: false,
    }
  ) {
    const chooseHandler = (selection: string): void => {
        onChoose(selection);

        this.close();
      },
      selectionList = h(
        e(
          'select[autofocus]',
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

  display(): Promise<void> {
    return super
      .display(false)
      .then(() =>
        (this.element().querySelector('select') as HTMLElement).focus()
      );
  }
}

export default SelectionWindow;
