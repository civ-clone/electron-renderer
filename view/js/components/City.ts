import {
  City as CityData,
  CityGrowth,
  ITransport,
  PlainObject,
} from '../types';
import { e, h, t } from '../lib/html.js';
import Cities from './Map/Cities.js';
import CityBuildSelectionWindow from './CityBuildSelectionWindow.js';
import ConfirmationWindow from './ConfirmationWindow.js';
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

const turns = (city: CityData) =>
    Math.max(
      1,
      Math.ceil(
        (city.build.cost.value - city.build.progress.value) /
          city.yields
            .filter((cityYield) => cityYield._ === 'Production')
            .reduce((total, cityYield) => total + cityYield.value, 0)
      )
    ),
  buildCityBuildDetails = (
    city: CityData,
    chooseProduction: () => void,
    completeProduction: () => void
  ): HTMLElement =>
    e(
      'div.build',
      e(
        'header',
        t(
          `Building ${
            city.build.building ? city.build.building.item._ : 'nothing'
          }`
        )
      ),
      city.build.building
        ? e(
            'p',
            t(
              `Progress ${city.build.progress.value} / ${
                city.build.cost.value
              } (${turns(city)} turn${turns(city) === 1 ? '' : 's'})`
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
        // TODO: have this passed in from the underlying trigger
        2,
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
        'div.yields-detail',
        // TODO: reduce/consolidate these
        ...Object.entries(
          city.yields.reduce((yieldObject, cityYield) => {
            if (!(cityYield._ in yieldObject)) {
              yieldObject[cityYield._] = 0;
            }

            yieldObject[cityYield._] += cityYield.value;

            return yieldObject;
          }, {} as PlainObject)
        ).map(([label, value]) =>
          e('div', e('div', t(label)), e('div', t(value)))
        )
      ),
      h(e('div.map', mapCanvas), {
        click: () =>
          transport.send('action', {
            name: 'ReassignWorkers',
            city: city.id,
          }),
      }),
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
        'div.garrisoned-units',
        e('header', t('Garrisoned Units')),
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
      ),
      e(
        'div.supported-units',
        e('header', t('Supported Units')),
        e(
          'ul',
          ...city.units.map((unit) =>
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
      ),
      e(
        'div.yields-detail',
        ...city.yields.map((cityYield) =>
          e(
            `div.${cityYield._.toLowerCase()}`,
            e(
              'div',
              t(
                `${cityYield._} (${cityYield.values
                  .map(([, description]) => description)
                  .join(', ')})`
              )
            ),
            e('div', t(cityYield.value.toString()))
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
        () => this.completeProduction()
      ),
      {
        size: 'maximised',
      }
    );

    this.#city = city;
    this.#dataObserver = new DataObserver(
      [
        city.id,
        city.build.id,
        city.growth.id,
        ...city.units.map((unit) => unit.id),
      ],
      (data: PlainObject) => {
        const [updatedCity] = (
          (data.player?.cities ?? []) as CityData[]
        ).filter((cityData: CityData) => city.id === cityData.id);

        // City must have been captured or destroyed
        if (!updatedCity) {
          this.close();

          return;
        }

        this.#city = updatedCity;

        this.#dataObserver.setIds([
          updatedCity.id,
          updatedCity.build.id,
          updatedCity.growth.id,
          ...updatedCity.units.map((unit) => unit.id),
        ]);

        this.update(
          buildDetails(
            updatedCity,
            () => this.changeProduction(),
            () => this.completeProduction()
          )
        );

        this.element().focus();
      }
    );

    this.element().addEventListener('keydown', (event) => {
      if (['c', 'C'].includes(event.key)) {
        this.changeProduction();

        event.preventDefault();
        event.stopPropagation();
      }

      if (['b', 'B'].includes(event.key)) {
        this.completeProduction();

        event.preventDefault();
        event.stopPropagation();
      }

      if (['Enter', 'x', 'X'].includes(event.key)) {
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

  completeProduction(): void {
    if (!this.#city.build.building) {
      return;
    }

    new ConfirmationWindow(
      'Are you sure?',
      `Do you want to rush building of ${this.#city.build.building.item._}`,
      () =>
        transport.send('action', {
          name: 'CompleteProduction',
          id: this.#city.id,
        })
    );
  }
}

export default City;
