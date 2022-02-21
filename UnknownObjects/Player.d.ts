import Civilization from '@civ-clone/core-civilization/Civilization';
import CorePlayer from '@civ-clone/core-player/Player';
import DataObject from '@civ-clone/core-data-object/DataObject';
export declare class Player extends DataObject {
  #private;
  constructor(civilization: Civilization);
  static fromPlayer(player: CorePlayer): Player;
  _(): string;
  civilization(): Civilization;
}
export default Player;
