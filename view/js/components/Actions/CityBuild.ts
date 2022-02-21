import { CityBuild as CityBuildObject } from '../../types';
import { e, h } from '../../lib/html.js';
import Action from './Action.js';
import CityBuildSelectionWindow from '../CityBuildSelectionWindow.js';

export class CityBuild extends Action {
  public activate(): void {
    new CityBuildSelectionWindow(this.value(), () => this.complete());
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
