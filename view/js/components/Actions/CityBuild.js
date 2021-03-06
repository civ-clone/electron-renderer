import { e, h } from '../../lib/html.js';
import Action from './Action.js';
import SelectionWindow from '../SelectionWindow.js';
export class CityBuild extends Action {
    build() {
        const cityBuild = this.value();
        this.element().append(h(e('button.cityBuild'), {
            click: () => {
                const chooseWindow = new SelectionWindow(`What do you want to build in ${cityBuild.city.name}?`, this.value().available.map((advance) => ({
                    value: advance._,
                })), [
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
                ]);
                chooseWindow.display();
            },
        }));
    }
    value() {
        return super.value();
    }
}
export default CityBuild;
//# sourceMappingURL=CityBuild.js.map