import { e, h, t } from '../lib/html.js';
import { City as CityData, CityBuild, CityGrowth, ITransport } from '../types';
import Portal from './Portal.js';
import Terrain from './Map/Terrain.js';
import World from './World.js';
import Yields from './Map/Yields.js';
import Cities from './Map/Cities.js';
import SelectionWindow from './SelectionWindow.js';

declare var transport: ITransport;

export class City {
  #city: CityData;
  #element: HTMLElement;

  constructor(city: CityData, element: HTMLElement = e('div.city')) {
    this.#city = city;
    this.#element = element;

    this.build();
  }

  build(): void {
    const mapCanvas = e('canvas') as HTMLCanvasElement;

    const worldData = this.#city.player.world,
      world = new World({
        ...worldData,
        tiles: this.#city.tiles,
      }),
      terrainMap = new Terrain(world),
      cityMap = new Cities(world),
      yieldWorld = new World({
        ...worldData,
        tiles: this.#city.tilesWorked,
      }),
      yieldMap = new Yields(yieldWorld),
      map = new Portal(world, mapCanvas, terrainMap, cityMap, yieldMap);

    cityMap.setShowNames(false);
    cityMap.render();

    const yields = this.#city.yields.reduce(
        (
          object: {
            [key: string]: number;
          },
          cityYield
        ) => {
          object[cityYield._] = cityYield.value;

          return object;
        },
        {}
      ),
      build: CityBuild = this.#city.build,
      growth: CityGrowth = this.#city.growth;

    map.setCenter(this.#city.tile.x, this.#city.tile.y);

    this.#element.append(
      e(
        'header',
        e('h2', t(this.#city.name)),
        h(e('button.close', t('Close')), {
          click: () => {
            this.#element.remove();
          },
        })
      ),
      e(
        'div.yields',
        ...this.#city.yields.map((cityYield) =>
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
          click: () => {
            const chooseWindow = new SelectionWindow(
              `What do you want to build in ${build.city.name}?`,
              build.available.map((advance) => ({
                value: advance._,
              })),
              [
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
              ]
            );

            chooseWindow.display();
          },
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
          ...this.#city.improvements.map((improvement) =>
            e('li', t(improvement._))
          )
        )
      )
    );
  }

  element(): HTMLElement {
    return this.#element;
  }
}

export default City;
