import { City, Tile, Unit } from '../types';

export class World {
  #data: Tile[] = [];
  #height: number;
  #width: number;

  constructor(height: number = 60, width: number = 80) {
    this.#height = height;
    this.#width = width;
  }

  get(x: number, y: number): Tile {
    while (x < 0) {
      x += this.#width;
    }

    while (y < 0) {
      y += this.#height;
    }

    return (
      this.#data.filter(
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

  getSurrounding(x: number, y: number, radius: number = 1): Tile[] {
    const tiles = [];

    for (
      let surroundingY = y - radius;
      surroundingY <= y + radius;
      surroundingY++
    ) {
      for (
        let surroundingX = x - radius;
        surroundingX <= x + radius;
        surroundingX++
      ) {
        tiles.push(this.get(surroundingX, surroundingY));
      }
    }

    return tiles;
  }

  getRows(): Tile[][] {
    const rows: Tile[][] = [];

    for (let y = 0; y < this.#height; y++) {
      rows[y] = [];

      for (let x = 0; x < this.#width; x++) {
        rows[y][x] = this.get(x, y);
      }
    }

    return rows;
  }

  height(): number {
    return this.#height;
  }

  width(): number {
    return this.#width;
  }

  setCityData(cities: City[]): void {
    cities.forEach((city: City) => {
      const tile = this.get(city.tile.x, city.tile.y);

      tile.city = city;
    });
  }

  setTileData(tiles: Tile[]): void {
    this.#data = tiles;
  }

  setUnitData(units: Unit[]): void {
    units.forEach((unit: Unit) => {
      const tile = this.get(unit.tile.x, unit.tile.y);

      if (!tile.units) {
        tile.units = [];
      }

      (tile.units as Unit[]).push(unit);
    });
  }
}

export default World;
