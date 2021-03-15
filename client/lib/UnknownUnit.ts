import DataObject from '@civ-clone/core-data-object/DataObject';
import EnemyPlayer from './EnemyPlayer';
import Unit from '@civ-clone/core-unit/Unit';

export class UnknownUnit extends DataObject {
  #player: EnemyPlayer;
  #unit: Unit;

  static unitMap: Map<Unit, UnknownUnit> = new Map();

  private constructor(unit: Unit) {
    super();

    this.#player = EnemyPlayer.get(unit.player());
    this.#unit = unit;

    this.addKey('player');
  }

  static get(unit: Unit): UnknownUnit {
    if (!this.unitMap.get(unit)) {
      this.unitMap.set(unit, new UnknownUnit(unit));
    }

    return this.unitMap.get(unit) as UnknownUnit;
  }

  player(): EnemyPlayer {
    return this.#player;
  }
}

export default UnknownUnit;
