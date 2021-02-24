import { a, e, h } from '../../lib/html.js';
import Action from './Action.js';
import SelectionWindow from '../SelectionWindow.js';
import {
  CityBuild as CityBuildObject,
  ITransport,
  PlayerResearch,
} from '../../types';

declare var transport: ITransport;

export class CityBuild extends Action {
  build(): void {
    const cityBuild = this.value();

    this.element().append(
      h(
        a(e('button'), {
          class: 'cityBuild',
        }),
        {
          click: () => {
            const chooseWindow = new SelectionWindow(
              `What do you want to build in ${cityBuild.city.name}?`,
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
                      name: 'CityBuild',
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
        }
      )
    );
  }

  value(): CityBuildObject {
    return super.value() as CityBuildObject;
  }
}

export default CityBuild;
