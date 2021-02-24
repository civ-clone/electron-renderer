import { a, e, t } from '../lib/html.js';
import { City as CityData } from '../types';
import Portal from './Portal.js';
import Terrain from './Map/Terrain';
import World from './World';
import Yields from './Map/Yields';

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

    const world = new World(this.#city.player.world),
      terrainMap = new Terrain(world),
      yieldWorld = new World(this.#city.player.world),
      yieldMap = new Yields(yieldWorld),
      map = new Portal(world, mapCanvas, terrainMap, yieldMap);

    map.setCenter(this.#city.tile.x, this.#city.tile.y);

    this.#element.append(
      e('header', e('h2', t(this.#city.name))),
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
