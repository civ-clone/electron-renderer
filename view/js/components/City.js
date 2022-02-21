var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _City_city;
import { e, h, t } from '../lib/html.js';
import Cities from './Map/Cities.js';
import CityBuildSelectionWindow from './CityBuildSelectionWindow.js';
import Portal from './Portal.js';
import Terrain from './Map/Terrain.js';
import Window from './Window.js';
import World from './World.js';
import Yields from './Map/Yields.js';
const buildDetails = (city) => {
    const mapCanvas = e('canvas'), build = city.build, growth = city.growth, world = new World(city.player.world), terrainMap = new Terrain(world), cityMap = new Cities(world), yieldMap = new Yields(world), map = new Portal(world, mapCanvas, terrainMap, cityMap, yieldMap);
    mapCanvas.height = terrainMap.tileSize() * 5;
    mapCanvas.width = terrainMap.tileSize() * 5;
    map.build();
    terrainMap.render(city.tiles);
    cityMap.setShowNames(false);
    cityMap.render(city.tiles);
    yieldMap.render(city.tilesWorked);
    map.setCenter(city.tile.x, city.tile.y);
    return e('div', e('div.yields', ...city.yields.map((cityYield) => e(`div.${cityYield._.toLowerCase()}`, e('div', t(cityYield._)), e('div', t(cityYield.value.toString()))))), e('div.map', mapCanvas), e('div.build', e('header', t(`Building ${build.building ? build.building._ : 'nothing'}`)), build.building
        ? e('p', t(`Progress ${build.progress.value} / ${build.cost.value}`))
        : t(''), h(e('button', t(build.building ? 'Change' : 'Choose')), {
        click: () => new CityBuildSelectionWindow(build),
    })), e('div.growth', e('header', t(growth.size.toString())), e('p', t(`Growth ${growth.progress.value} / ${growth.cost.value}`))), e('div.improvements', e('header', t('Improvements')), e('ul', ...city.improvements.map((improvement) => e('li', t(improvement._))))));
};
export class City extends Window {
    constructor(city) {
        super(city.name, buildDetails(city), {
            size: 'maximised',
        });
        _City_city.set(this, void 0);
        __classPrivateFieldSet(this, _City_city, city, "f");
    }
}
_City_city = new WeakMap();
export default City;
//# sourceMappingURL=City.js.map