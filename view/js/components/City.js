var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _city, _element;
import { e, h, t } from '../lib/html.js';
import Portal from './Portal.js';
import Terrain from './Map/Terrain.js';
import World from './World.js';
import Yields from './Map/Yields.js';
import Cities from './Map/Cities.js';
import SelectionWindow from './SelectionWindow.js';
export class City {
    constructor(city, element = e('div.city')) {
        _city.set(this, void 0);
        _element.set(this, void 0);
        __classPrivateFieldSet(this, _city, city);
        __classPrivateFieldSet(this, _element, element);
        this.build();
    }
    build() {
        const mapCanvas = e('canvas');
        const worldData = __classPrivateFieldGet(this, _city).player.world, world = new World({
            ...worldData,
            tiles: __classPrivateFieldGet(this, _city).tiles,
        }), terrainMap = new Terrain(world), cityMap = new Cities(world), yieldWorld = new World({
            ...worldData,
            tiles: __classPrivateFieldGet(this, _city).tilesWorked,
        }), yieldMap = new Yields(yieldWorld), map = new Portal(world, mapCanvas, terrainMap, cityMap, yieldMap);
        cityMap.setShowNames(false);
        cityMap.render();
        const yields = __classPrivateFieldGet(this, _city).yields.reduce((object, cityYield) => {
            object[cityYield._] = cityYield.value;
            return object;
        }, {}), build = __classPrivateFieldGet(this, _city).build, growth = __classPrivateFieldGet(this, _city).growth;
        map.setCenter(__classPrivateFieldGet(this, _city).tile.x, __classPrivateFieldGet(this, _city).tile.y);
        __classPrivateFieldGet(this, _element).append(e('header', e('h2', t(__classPrivateFieldGet(this, _city).name)), h(e('button.close', t('Close')), {
            click: () => {
                __classPrivateFieldGet(this, _element).remove();
            },
        })), e('div.yields', ...__classPrivateFieldGet(this, _city).yields.map((cityYield) => e(`div.${cityYield._.toLowerCase()}`, e('div', t(cityYield._)), e('div', t(cityYield.value.toString()))))), e('div.map', mapCanvas), e('div.build', e('header', t(`Building ${build.building ? build.building._ : 'nothing'}`)), build.building
            ? e('p', t(`Progress ${build.progress.value} / ${build.cost.value}`))
            : t(''), h(e('button', t(build.building ? 'Change' : 'Choose')), {
            click: () => {
                const chooseWindow = new SelectionWindow(`What do you want to build in ${build.city.name}?`, build.available.map((advance) => ({
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
                                id: build.id,
                                chosen: selection ? selection : '@',
                            });
                            chooseWindow.close();
                        },
                    },
                ]);
                chooseWindow.display();
            },
        })), e('div.growth', e('header', t(growth.size.toString())), e('p', t(`Growth ${growth.progress.value} / ${growth.cost.value}`))), e('div.improvements', e('header', t('Improvements')), e('ul', ...__classPrivateFieldGet(this, _city).improvements.map((improvement) => e('li', t(improvement._))))));
    }
    element() {
        return __classPrivateFieldGet(this, _element);
    }
}
_city = new WeakMap(), _element = new WeakMap();
export default City;
//# sourceMappingURL=City.js.map