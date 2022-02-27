import { Tile } from '../../types';
import { Map, IMap } from '../Map.js';
export declare class TerrainAbstract extends Map implements IMap {
  update(tilesToUpdate: Tile[]): void;
}
export default TerrainAbstract;
