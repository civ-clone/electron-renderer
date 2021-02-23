import { Unit } from '../../types';
import { Map, IMap } from '../Map.js';
export declare class ActiveUnit extends Map implements IMap {
  render(activeUnit?: Unit | null): void;
}
export default ActiveUnit;
