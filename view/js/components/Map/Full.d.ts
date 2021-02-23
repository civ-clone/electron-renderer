import { Tile } from '../../types';
import { Map, IMap } from '../Map.js';
export declare class Full extends Map implements IMap {
  render(tiles?: Tile[]): void;
}
export default Full;
