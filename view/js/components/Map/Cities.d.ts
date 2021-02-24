import { Tile, Unit } from '../../types';
import { Map, IMap } from '../Map.js';
export declare class Cities extends Map implements IMap {
    render(tiles?: Tile[], activeUnit?: Unit | null): void;
}
export default Cities;
