import City from '@civ-clone/core-city/City';
import DataObject from '@civ-clone/core-data-object/DataObject';
import EnemyCity from './EnemyCity';
import EnemyUnit from './EnemyUnit';
import { EntityInstance } from '../../view/js/types';
import Player from '@civ-clone/core-player/Player';
import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import Unit from '@civ-clone/core-unit/Unit';
import UnknownUnit from './UnknownUnit';
import Yield from '@civ-clone/core-yield/Yield';
import { instance as cityRegistryInstance } from '@civ-clone/core-city/CityRegistry';
import { instance as goodyHutRegistry } from '@civ-clone/core-goody-hut/GoodyHutRegistry';
import { instance as tileImprovementRegistryInstance } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import { instance as unitRegistryInstance } from '@civ-clone/core-unit/UnitRegistry';

export class BasicTile extends DataObject {
  static tileMap: Map<Tile, BasicTile> = new Map();

  #player: Player;
  #tile: Tile;

  private constructor(tile: Tile, player: Player) {
    super();

    this.#player = player;
    this.#tile = tile;

    this.addKey(
      'city',
      'goodyHut',
      'improvements',
      'isCoast',
      'isLand',
      'isWater',
      'terrain',
      'units',
      'x',
      'y',
      'yields'
    );
  }

  static get(tile: Tile, player: Player): BasicTile {
    if (!this.tileMap.get(tile)) {
      this.tileMap.set(tile, new this(tile, player));
    }

    return this.tileMap.get(tile) as BasicTile;
  }

  city(): City | EnemyCity | null {
    const [city] = cityRegistryInstance.getByTile(this.#tile);

    if (city === undefined) {
      return null;
    }

    if (city.player() === this.#player) {
      return city;
    }

    return EnemyCity.get(city);
  }

  goodyHut(): EntityInstance | null {
    const goodyHut = goodyHutRegistry.getByTile(this.#tile);

    return goodyHut ? { _: 'GoodyHut', id: goodyHut.id() } : null;
  }

  id(): string {
    return this.#tile.id();
  }

  improvements(): TileImprovement[] {
    return tileImprovementRegistryInstance.getByTile(this.#tile);
  }

  isCoast(): boolean {
    return this.#tile.isCoast();
  }

  isLand(): boolean {
    return this.#tile.isLand();
  }

  isWater(): boolean {
    return this.#tile.isWater();
  }

  terrain(): Terrain {
    return this.#tile.terrain();
  }

  units(): Unit[] | (EnemyUnit | UnknownUnit)[] {
    const units = unitRegistryInstance.getByTile(this.#tile);

    if (units.length === 0) {
      return [];
    }

    if (units[0].player() === this.#player) {
      return units;
    }

    const [defensiveUnit] = units.sort(
      (a: Unit, b: Unit) => b.defence().value() - a.defence().value()
    );

    if (units.length === 1) {
      return [defensiveUnit];
    }

    return [EnemyUnit.get(defensiveUnit), UnknownUnit.get(defensiveUnit)];
  }

  x(): number {
    return this.#tile.x();
  }

  y(): number {
    return this.#tile.y();
  }

  yields(player: Player = new Player()): Yield[] {
    return this.#tile.yields(player);
  }
}

export default BasicTile;
