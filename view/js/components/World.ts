import { Tile, World as WorldData } from '../types';

export class World {
  #tiles: Tile[];
  #height: number;
  #width: number;

  constructor(world: WorldData) {
    this.#height = world.height;
    this.#width = world.width;
    this.#tiles = Object.values(world.tiles) || [];
  }

  get(x: number, y: number): Tile {
    while (x < 0) {
      x += this.#width;
    }

    while (y < 0) {
      y += this.#height;
    }

    return (
      this.#tiles.filter(
        (tile: Tile) =>
          tile.x === x % this.#width && tile.y === y % this.#height
      )[0] || {
        improvements: [],
        isLand: false,
        isOcean: false,
        terrain: {
          _: 'Unknown',
        },
        units: [],
        x,
        y,
        yields: [],
      }
    );
  }

  getNeighbour(
    tile: Tile,
    direction: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
  ): Tile {
    if (direction === 'n') {
      return this.get(tile.x, tile.y - 1);
    }

    if (direction === 'ne') {
      return this.get(tile.x + 1, tile.y - 1);
    }

    if (direction === 'e') {
      return this.get(tile.x + 1, tile.y);
    }

    if (direction === 'se') {
      return this.get(tile.x + 1, tile.y + 1);
    }

    if (direction === 's') {
      return this.get(tile.x, tile.y + 1);
    }

    if (direction === 'sw') {
      return this.get(tile.x - 1, tile.y + 1);
    }

    if (direction === 'w') {
      return this.get(tile.x - 1, tile.y);
    }

    if (direction === 'nw') {
      return this.get(tile.x - 1, tile.y - 1);
    }

    throw new TypeError('Invalid direction.');
  }

  height(): number {
    return this.#height;
  }

  tiles(): Tile[] {
    return this.#tiles;
  }

  width(): number {
    return this.#width;
  }

  setTileData(tiles: Tile[]): void {
    this.#tiles = tiles;
  }
}

export default World;
