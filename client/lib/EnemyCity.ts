import City from '@civ-clone/core-city/City';
import DataObject from '@civ-clone/core-data-object/DataObject';
import EnemyPlayer from './EnemyPlayer';
import { instance as cityGrowthRegistryInstance } from '@civ-clone/core-city-growth/CityGrowthRegistry';

export class EnemyCity extends DataObject {
  static cityMap: Map<City, EnemyCity> = new Map();

  #city: City;
  #player: EnemyPlayer;

  private constructor(city: City) {
    super();

    this.#city = city;
    this.#player = EnemyPlayer.get(city.player());

    this.addKey('growth', 'name', 'player');
  }

  static get(city: City): EnemyCity {
    if (!this.cityMap.get(city)) {
      this.cityMap.set(city, new EnemyCity(city));
    }

    return this.cityMap.get(city) as EnemyCity;
  }

  growth(): { size: number } {
    const cityGrowth = cityGrowthRegistryInstance.getByCity(this.#city);

    return {
      size: cityGrowth.size(),
    };
  }

  name(): string {
    return this.#city.name();
  }

  player(): EnemyPlayer {
    return this.#player;
  }
}

export default EnemyCity;
