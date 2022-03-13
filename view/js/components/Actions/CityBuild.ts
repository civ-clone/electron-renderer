import { CityBuild as CityBuildObject, PlayerAction } from '../../types';
import { e, h } from '../../lib/html.js';
import Action from './Action.js';
import CityBuildSelectionWindow from '../CityBuildSelectionWindow.js';
import Portal from '../Portal.js';

export class CityBuild extends Action {
  #portal: Portal;

  constructor(action: PlayerAction, portal: Portal) {
    super(action);

    this.#portal = portal;
  }

  public activate(): void {
    new CityBuildSelectionWindow(this.value(), () => this.complete(), {
      showCity: CityBuildSelectionWindow.showCityAction(this.value().city),
      showCityOnMap: CityBuildSelectionWindow.showCityOnMapAction(
        this.value().city,
        this.#portal
      ),
    });
  }

  build(): void {
    const cityBuild = this.value();

    this.element().append(
      e(
        `button.cityBuild[title="What would you like to build in ${cityBuild.city.name}?"]`
      )
    );
  }

  value(): CityBuildObject {
    return super.value() as CityBuildObject;
  }
}

export default CityBuild;
