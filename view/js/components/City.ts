import {
  City as CityData,
  CityGrowth,
  ITransport,
  PlainObject,
} from '../types';
import { e, h, t } from '../lib/html.js';
import Cities from './Map/Cities.js';
import CityBuildSelectionWindow from './CityBuildSelectionWindow.js';
import DataObserver from '../lib/DataObserver.js';
import Feature from './Map/Feature.js';
import Fog from './Map/Fog.js';
import Improvements from './Map/Improvements.js';
import Irrigation from './Map/Irrigation.js';
import Land from './Map/Land.js';
import Portal from './Portal.js';
import Terrain from './Map/Terrain.js';
import Window from './Window.js';
import World from './World.js';
import Yields from './Map/Yields.js';

declare var transport: ITransport;

const buildCityBuildDetails = (
    city: CityData,
    chooseProduction: () => void,
    completeProduction: () => void
  ): HTMLElement =>
    e(
      'div.build',
      e(
        'header',
        t(`Building ${city.build.building ? city.build.building._ : 'nothing'}`)
      ),
      city.build.building
        ? e(
            'p',
            t(
              `Progress ${city.build.progress.value} / ${city.build.cost.value}`
            )
          )
        : t(''),
      h(e('button', t(city.build.building ? 'Change' : 'Choose')), {
        click: () => chooseProduction(),
      }),
      h(e('button', t('Buy')), {
        click: () => completeProduction(),
      })
    ),
  buildDetails = (
    city: CityData,
    chooseProduction: () => void,
    completeProduction: () => void
  ) => {
    const mapCanvas = e('canvas') as HTMLCanvasElement,
      growth: CityGrowth = city.growth,
      world = new World(city.player.world),
      landMap = new Land(world),
      irrigationMap = new Irrigation(world),
      terrainMap = new Terrain(world),
      improvementsMap = new Improvements(world),
      featureMap = new Feature(world),
      fogMap = new Fog(world),
      cityMap = new Cities(world),
      yieldMap = new Yields(world),
      map = new Portal(
        world,
        mapCanvas,
        landMap,
        irrigationMap,
        terrainMap,
        improvementsMap,
        featureMap,
        fogMap,
        cityMap,
        yieldMap
      );

    mapCanvas.height = terrainMap.tileSize() * 5;
    mapCanvas.width = terrainMap.tileSize() * 5;

    map.build(city.tiles);

    terrainMap.render(city.tiles);
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
      buildCityBuildDetails(city, chooseProduction, completeProduction),
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
      ),
      e(
        'div.units',
        e('header', t('Units')),
        e(
          'ul',
          ...city.tile.units.map((unit) =>
            e(
              'li',
              t(
                unit._ +
                  (unit.improvements.length
                    ? ' (' +
                      unit.improvements
                        .map((improvement) => improvement._)
                        .join(', ') +
                      ')'
                    : '')
              )
            )
          )
        )
      )
    );
  };

export class City extends Window {
  #city: CityData;
  #dataObserver: DataObserver;

  constructor(city: CityData) {
    super(
      city.name,
      buildDetails(
        city,
        () => this.changeProduction(),
        () => this.completeProduction(city)
      ),
      {
        size: 'maximised',
      }
    );

    this.#city = city;
    this.#dataObserver = new DataObserver(
      [city.id, city.build.id, city.growth.id],
      (data: PlainObject) => {
        const [updatedCity] = (data.player?.cities ?? []).filter(
          (cityData: CityData) => city.id === cityData.id
        );

        if (!updatedCity) {
          this.close();

          return;
        }

        this.#city = updatedCity;

        this.update(
          buildDetails(
            updatedCity,
            () => this.changeProduction(),
            () => this.completeProduction(city)
          )
        );

        this.element().focus();
      }
    );

    this.element().addEventListener('keydown', (event) => {
      if (['c', 'C'].includes(event.key)) {
        this.changeProduction();
      }

      if (event.key === 'Enter') {
        this.close();
      }
    });
  }

  changeProduction(): void {
    new CityBuildSelectionWindow(this.#city.build, () =>
      this.element().focus()
    );
  }

  close(): void {
    this.#dataObserver.dispose();

    super.close();
  }

  completeProduction(city: CityData): void {
    transport.send('action', {
      name: 'CompleteProduction',
      id: city.id,
    });
  }
}

export default City;
