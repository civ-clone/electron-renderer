import DataObject from '@civ-clone/core-data-object/DataObject';
import Player from '@civ-clone/core-player/Player';

export class TransferObject extends DataObject {
  #player: Player;

  constructor(player: Player) {
    super();

    this.#player = player;

    this.addKey('player');
  }

  player() {
    return this.#player;
  }
}

export default TransferObject;
