import CoreCity from '@civ-clone/core-city/City';
import DataObject from '@civ-clone/core-data-object/DataObject';
import Player from '@civ-clone/core-player/Player';
import Tile from '@civ-clone/core-world/Tile';
export declare class City extends DataObject {
  #private;
  constructor(name: string, tile: Tile, player: Player, size: number);
  static fromCity(city: CoreCity): City;
  _(): string;
  name(): string;
  player(): Player;
  growth(): {
    size: number;
  };
  tile(): Tile;
}
export default City;
