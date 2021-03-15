import DataObject from '@civ-clone/core-data-object/DataObject';
import EnemyPlayer from './EnemyPlayer';
import Unit from '@civ-clone/core-unit/Unit';
import Yield from '@civ-clone/core-yield/Yield';
export declare class EnemyUnit extends DataObject {
    #private;
    static unitMap: Map<Unit, EnemyUnit>;
    private constructor();
    static get(unit: Unit): EnemyUnit;
    _(): string;
    defence(): Yield;
    improvements(): {
        _: string;
    }[];
    player(): EnemyPlayer;
}
export default EnemyUnit;
