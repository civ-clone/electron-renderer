import { a, e, h, t } from '../lib/html.js';
import NotificationWindow from './NotificationWindow.js';

export interface SelectionWindowAction {
  label: string;
  handler: (selection: string) => void;
}

export interface SelectionWindowOption {
  label?: string;
  value: any;
}

export class SelectionWindow extends NotificationWindow {
  constructor(
    title: string,
    options: SelectionWindowOption[],
    actions: SelectionWindowAction[],
    body: string | Node = 'Please choose one of the following:'
  ) {
    const selectionList = e(
      'select',
      ...options.map((option) =>
        a(e('option', t(option.label || option.value)), {
          value: option.value,
        })
      )
    ) as HTMLSelectElement;

    super(
      title,
      e(
        'div',
        body instanceof Node ? body : e('p', t(body)),
        selectionList,
        e(
          'footer',
          ...actions.map((action) =>
            h(e('button', t(action.label)), {
              click: () => {
                action.handler(selectionList.value);
              },
            })
          )
        )
      )
    );
  }
}

export default SelectionWindow;
