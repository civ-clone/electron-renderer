import { Tile } from '../types';
export declare class World {
  #private;
  constructor(height?: number, width?: number);
  get(x: number, y: number): Tile;
  getNeighbour(
    tile: Tile,
    direction: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
  ): Tile;
  getSurrounding(x: number, y: number, radius?: number): Tile[];
  getRows(): Tile[][];
  height(): number;
  tiles(): Tile[];
  width(): number;
  setTileData(tiles: Tile[]): void;
}
export default World;
