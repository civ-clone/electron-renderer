import { City as CityData, CityBuild, CityGrowth } from '../types';
import { e, h, t } from '../lib/html.js';
import Cities from './Map/Cities.js';
import CityBuildSelectionWindow from './CityBuildSelectionWindow.js';
import Portal from './Portal.js';
import Terrain from './Map/Terrain.js';
import Window from './Window.js';
import World from './World.js';
import Yields from './Map/Yields.js';

const buildDetails = (city: CityData) => {
  const mapCanvas = e('canvas') as HTMLCanvasElement,
    build: CityBuild = city.build,
    growth: CityGrowth = city.growth,
    world = new World(city.player.world),
    terrainMap = new Terrain(world),
    cityMap = new Cities(world),
    yieldMap = new Yields(world),
    map = new Portal(world, mapCanvas, terrainMap, cityMap, yieldMap);

  mapCanvas.height = terrainMap.tileSize() * 5;
  mapCanvas.width = terrainMap.tileSize() * 5;

  map.build();

  terrainMap.render(city.tiles);
  cityMap.setShowNames(false);
  cityMap.render(city.tiles);
  yieldMap.render(city.tilesWorked);
  map.setCenter(city.tile.x, city.tile.y);

  return e(
    'div',
    e(
      'div.yields',
      ...city.yields.map((cityYield) =>
        e(
          `div.${cityYield._.toLowerCase()}`,
          e('div', t(cityYield._)),
          e('div', t(cityYield.value.toString()))
        )
      )
    ),
    e('div.map', mapCanvas),
    e(
      'div.build',
      e(
        'header',
        t(`Building ${build.building ? build.building._ : 'nothing'}`)
      ),
      build.building
        ? e('p', t(`Progress ${build.progress.value} / ${build.cost.value}`))
        : t(''),
      h(e('button', t(build.building ? 'Change' : 'Choose')), {
        click: () => new CityBuildSelectionWindow(build),
      })
    ),
    e(
      'div.growth',
      e('header', t(growth.size.toString())),
      e('p', t(`Growth ${growth.progress.value} / ${growth.cost.value}`))
    ),
    e(
      'div.improvements',
      e('header', t('Improvements')),
      e(
        'ul',
        ...city.improvements.map((improvement) => e('li', t(improvement._)))
      )
    )
  );
};

export class City extends Window {
  #city: CityData;

  constructor(city: CityData) {
    super(city.name, buildDetails(city), {
      size: 'maximised',
    });

    this.#city = city;
  }
}

export default City;
