import SelectionWindow from './SelectionWindow.js';
export class CityBuildSelectionWindow extends SelectionWindow {
    constructor(cityBuild, onComplete = () => { }) {
        super(`What would you like to build in ${cityBuild.city.name}?`, cityBuild.available.map((advance) => ({
            value: advance._,
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
            displayAll: true,
        });
        this.onComplete = onComplete;
    }
    close(hasSelected = false) {
        super.close();
        this.onComplete(hasSelected);
    }
}
export default CityBuildSelectionWindow;
//# sourceMappingURL=CityBuildSelectionWindow.js.map