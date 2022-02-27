import { NeighbourDirection, Tile, World as WorldData } from '../types';
export declare class World {
  #private;
  constructor(world: WorldData);
  get(x: number, y: number): Tile;
  getNeighbour(tile: Tile, direction: NeighbourDirection): Tile;
  height(): number;
  tiles(): Tile[];
  width(): number;
  setTileData(tiles: Tile[]): void;
}
export default World;
