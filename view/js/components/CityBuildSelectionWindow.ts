import { CityBuild, ITransport } from '../types';
import SelectionWindow from './SelectionWindow.js';

declare var transport: ITransport;

type onCompleteHandler = (hasSelected: boolean, ...args: any[]) => void;

export class CityBuildSelectionWindow extends SelectionWindow {
  private onComplete: onCompleteHandler;

  constructor(cityBuild: CityBuild, onComplete: onCompleteHandler = () => {}) {
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

        this.close(true);
      },
      null,
      {
        displayAll: true,
      }
    );

    this.onComplete = onComplete;
  }

  close(hasSelected: boolean = false): void {
    super.close();

    this.onComplete(hasSelected);
  }
}

export default CityBuildSelectionWindow;
