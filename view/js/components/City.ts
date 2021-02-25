import { a, e, h, t } from '../lib/html.js';
import { City as CityData } from '../types';
import Portal from './Portal.js';
import Terrain from './Map/Terrain.js';
import World from './World.js';
import Yields from './Map/Yields.js';
import Cities from './Map/Cities.js';

export class City {
  #city: CityData;
  #element: HTMLElement;

  constructor(
    city: CityData,
    element: HTMLElement = a(e('div'), {
      class: 'city',
    })
  ) {
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

    map.setCenter(this.#city.tile.x, this.#city.tile.y);

    this.#element.append(
      e(
        'header',
        e('h2', t(this.#city.name)),
        h(
          a(e('button', t('Close')), {
            class: 'close',
          }),
          {
            click: () => {
              this.#element.remove();
            },
          }
        )
      ),
      a(
        e(
          'div',
          ...this.#city.yields.map((cityYield) =>
            a(
              e(
                'div',
                e('div', t(cityYield._)),
                e('div', t(cityYield.value.toString()))
              ),
              {
                class: cityYield._.toLowerCase(),
              }
            )
          )
        ),
        {
          class: 'yields',
        }
      ),
      a(e('div', mapCanvas), {
        class: 'map',
      })
    );
  }

  element(): HTMLElement {
    return this.#element;
  }
}

export default City;
