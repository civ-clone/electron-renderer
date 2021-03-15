import DataObject from '@civ-clone/core-data-object/DataObject';
import EnemyPlayer from './EnemyPlayer';
import Unit from '@civ-clone/core-unit/Unit';
import Yield from '@civ-clone/core-yield/Yield';

export class EnemyUnit extends DataObject {
  #player: EnemyPlayer;
  #unit: Unit;

  static unitMap: Map<Unit, EnemyUnit> = new Map();

  private constructor(unit: Unit) {
    super();

    this.#player = EnemyPlayer.get(unit.player());
    this.#unit = unit;

    this.addKey('_', 'defence', 'improvements', 'player');
  }

  static get(unit: Unit): EnemyUnit {
    if (!this.unitMap.get(unit)) {
      this.unitMap.set(unit, new EnemyUnit(unit));
    }

    return this.unitMap.get(unit) as EnemyUnit;
  }

  _(): string {
    return this.#unit.constructor.name;
  }

  defence(): Yield {
    return this.#unit.defence();
  }

  // TODO: track fortified
  improvements(): { _: string }[] {
    return [];
  }

  player(): EnemyPlayer {
    return this.#player;
  }
}

export default EnemyUnit;
