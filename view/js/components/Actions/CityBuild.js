import { e } from '../../lib/html.js';
import Action from './Action.js';
import CityBuildSelectionWindow from '../CityBuildSelectionWindow.js';
export class CityBuild extends Action {
    activate() {
        new CityBuildSelectionWindow(this.value(), () => this.complete());
    }
    build() {
        const cityBuild = this.value();
        this.element().append(e(`button.cityBuild[title="What would you like to build in ${cityBuild.city.name}?"]`));
    }
    value() {
        return super.value();
    }
}
export default CityBuild;
//# sourceMappingURL=CityBuild.js.map