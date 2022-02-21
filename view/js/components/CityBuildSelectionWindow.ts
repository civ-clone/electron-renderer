import { CityBuild, ITransport } from '../types';
import SelectionWindow from './SelectionWindow.js';

declare var transport: ITransport;

export class CityBuildSelectionWindow extends SelectionWindow {
  constructor(cityBuild: CityBuild, onComplete: () => void = () => {}) {
    super(
      `What would you like to build in ${cityBuild.city.name}?`,
      cityBuild.available.map((advance) => ({
        value: advance._,
      })),
      (selection) => {
        if (!selection) {
          return;
        }

        transport.send('action', {
          name: cityBuild.building === null ? 'CityBuild' : 'ChangeProduction',
          id: cityBuild.id,
          chosen: selection ? selection : '@',
        });

        this.close();

        onComplete();
      },
      null,
      {
        displayAll: true,
      }
    );
  }
}

export default CityBuildSelectionWindow;
