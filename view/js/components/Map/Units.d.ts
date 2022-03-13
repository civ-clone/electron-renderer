import { Tile, Unit } from '../../types';
import { Map, IMap } from '../Map.js';
export declare class Units extends Map implements IMap {
  #private;
  renderTile(tile: Tile): void;
  protected renderUnit(unit: Unit): CanvasImageSource;
  setActiveUnit(unit: Unit | null): void;
  protected activeUnit(): Unit | null;
}
export default Units;
