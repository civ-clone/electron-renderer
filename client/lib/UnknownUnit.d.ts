import DataObject from '@civ-clone/core-data-object/DataObject';
import EnemyPlayer from './EnemyPlayer';
import Unit from '@civ-clone/core-unit/Unit';
export declare class UnknownUnit extends DataObject {
    #private;
    static unitMap: Map<Unit, UnknownUnit>;
    private constructor();
    static get(unit: Unit): UnknownUnit;
    player(): EnemyPlayer;
}
export default UnknownUnit;
