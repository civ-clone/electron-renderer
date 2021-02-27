import Action from './Action.js';
import { e, h } from '../../lib/html.js';
import SelectionWindow from '../SelectionWindow.js';
import { ITransport, PlayerResearch } from '../../types';

declare var transport: ITransport;

export class ChooseResearch extends Action {
  build(): void {
    this.element().append(
      h(e('button.chooseResearch'), {
        click: () => {
          const chooseWindow = new SelectionWindow(
            'Choose research',
            this.value().available.map((advance) => ({
              value: advance._,
            })),
            [
              {
                label: 'OK',
                handler: (selection) => {
                  if (!selection) {
                    return;
                  }

                  transport.send('action', {
                    name: 'ChooseResearch',
                    id: this.value().id,
                    chosen: selection ? selection : '@',
                  });

                  chooseWindow.close();

                  this.complete();
                },
              },
            ]
          );

          chooseWindow.display();
        },
      })
    );
  }

  value(): PlayerResearch {
    return super.value() as PlayerResearch;
  }
}

export default ChooseResearch;
