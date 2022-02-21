import CoreUnit from '@civ-clone/core-unit/Unit';
import DataObject from '@civ-clone/core-data-object/DataObject';
import Player from '@civ-clone/core-player/Player';
import Tile from '@civ-clone/core-world/Tile';
export declare class Unit extends DataObject {
  #private;
  constructor(name: string, tile: Tile, player: Player);
  static fromUnit(unit: CoreUnit): Unit;
  _(): string;
  player(): Player;
  tile(): Tile;
}
export default Unit;
