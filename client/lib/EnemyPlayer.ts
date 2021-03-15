import Civilization from '@civ-clone/core-civilization/Civilization';
import DataObject from '@civ-clone/core-data-object/DataObject';
import Player from '@civ-clone/core-player/Player';

export class EnemyPlayer extends DataObject {
  static playerMap: Map<Player, EnemyPlayer> = new Map();

  #player: Player;

  private constructor(player: Player) {
    super();

    this.#player = player;

    this.addKey('civilization');
  }

  static get(player: Player): EnemyPlayer {
    if (!this.playerMap.get(player)) {
      this.playerMap.set(player, new EnemyPlayer(player));
    }

    return this.playerMap.get(player) as EnemyPlayer;
  }

  civilization(): Civilization {
    return this.#player.civilization();
  }
}

export default EnemyPlayer;
