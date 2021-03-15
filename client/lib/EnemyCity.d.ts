import City from '@civ-clone/core-city/City';
import DataObject from '@civ-clone/core-data-object/DataObject';
import EnemyPlayer from './EnemyPlayer';
export declare class EnemyCity extends DataObject {
    #private;
    static cityMap: Map<City, EnemyCity>;
    private constructor();
    static get(city: City): EnemyCity;
    growth(): {
        size: number;
    };
    name(): string;
    player(): EnemyPlayer;
}
export default EnemyCity;
