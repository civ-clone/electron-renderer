import { BuildItem, City as CityData, CityBuild, ITransport } from '../types';
import { SelectionWindow, SelectionWindowActions } from './SelectionWindow.js';
import City from './City.js';
import Portal from './Portal';

declare var transport: ITransport;

type onCompleteHandler = (hasSelected: boolean, ...args: any[]) => void;

export class CityBuildSelectionWindow extends SelectionWindow {
  private onComplete: onCompleteHandler;

  public static showCityAction = (city: CityData) => ({
    label: 'View city',
    action(selectionWindow: SelectionWindow) {
      selectionWindow.close();

      new City(city);
    },
  });
  public static showCityOnMapAction = (city: CityData, portal: Portal) => ({
    label: 'Show on map',
    action(selectionWindow: SelectionWindow) {
      selectionWindow.close();

      portal.setCenter(city.tile.x, city.tile.y);
    },
  });

  constructor(
    cityBuild: CityBuild,
    onComplete: onCompleteHandler = () => {},
    additionalActions: SelectionWindowActions = {}
  ) {
    const production = cityBuild.city.yields
        .filter((cityYield) => cityYield._ === 'Production')
        .reduce((total, cityYield) => total + cityYield.value, 0),
      turns = (buildItem: BuildItem) =>
        Math.ceil(
          (buildItem.cost.value - cityBuild.progress.value) / production
        );

    super(
      `What would you like to build in ${cityBuild.city.name}?`,
      cityBuild.available.map((buildItem) => ({
        label: `${buildItem.item._} (Cost: ${buildItem.cost.value} / ${turns(
          buildItem
        )} turn${turns(buildItem) === 1 ? '' : 's'})`,
        value: buildItem.item._,
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
        actions: additionalActions,
        displayAll: true,
      }
    );

    this.onComplete = onComplete;
  }

  close(hasSelected: boolean = false): void {
    super.close();

    if (hasSelected) {
      this.onComplete(hasSelected);
    }
  }
}

export default CityBuildSelectionWindow;
