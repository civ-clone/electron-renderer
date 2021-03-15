import Civilization from '@civ-clone/core-civilization/Civilization';
import DataObject from '@civ-clone/core-data-object/DataObject';
import Player from '@civ-clone/core-player/Player';
export declare class EnemyPlayer extends DataObject {
    #private;
    static playerMap: Map<Player, EnemyPlayer>;
    private constructor();
    static get(player: Player): EnemyPlayer;
    civilization(): Civilization;
}
export default EnemyPlayer;
