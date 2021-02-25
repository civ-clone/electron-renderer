import { Tile, Unit } from '../../types';
import { Map, IMap } from '../Map.js';
export interface ICities extends IMap {
    setShowSize(showSize: boolean): void;
    setShowNames(showNames: boolean): void;
}
export declare class Cities extends Map implements ICities {
    #private;
    render(tiles?: Tile[], activeUnit?: Unit | null): void;
    setShowSize(showSize: boolean): void;
    setShowNames(showNames: boolean): void;
}
export default Cities;
