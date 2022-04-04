import { SelectionWindow } from './SelectionWindow.js';
import City from './City.js';
export class CityBuildSelectionWindow extends SelectionWindow {
    constructor(cityBuild, onComplete = () => { }, additionalActions = {}) {
        const production = cityBuild.city.yields
            .filter((cityYield) => cityYield._ === 'Production')
            .reduce((total, cityYield) => total + cityYield.value, 0), turns = (buildItem) => Math.ceil((buildItem.cost.value - cityBuild.progress.value) / production);
        super(`What would you like to build in ${cityBuild.city.name}?`, cityBuild.available.map((buildItem) => ({
            label: `${buildItem.item._} (Cost: ${buildItem.cost.value} / ${turns(buildItem)} turn${turns(buildItem) === 1 ? '' : 's'})`,
            value: buildItem.item._,
        })), (selection) => {
            if (!selection) {
                return;
            }
            transport.send('action', {
                name: cityBuild.building === null ? 'CityBuild' : 'ChangeProduction',
                id: cityBuild.id,
                chosen: selection ? selection : '@',
            });
            this.close(true);
        }, null, {
            actions: additionalActions,
            displayAll: true,
        });
        this.onComplete = onComplete;
    }
    close(hasSelected = false) {
        super.close();
        if (hasSelected) {
            this.onComplete(hasSelected);
        }
    }
}
CityBuildSelectionWindow.showCityAction = (city) => ({
    label: 'View city',
    action(selectionWindow) {
        selectionWindow.close();
        new City(city);
    },
});
CityBuildSelectionWindow.showCityOnMapAction = (city, portal) => ({
    label: 'Show on map',
    action(selectionWindow) {
        selectionWindow.close();
        portal.setCenter(city.tile.x, city.tile.y);
    },
});
export default CityBuildSelectionWindow;
//# sourceMappingURL=CityBuildSelectionWindow.js.map