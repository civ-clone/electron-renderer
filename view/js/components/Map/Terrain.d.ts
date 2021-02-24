import { Tile } from '../../types';
import { Map, IMap } from '../Map.js';
export declare class Terrain extends Map implements IMap {
    render(tiles?: Tile[]): void;
}
export default Terrain;
