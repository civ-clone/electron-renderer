import { CityBuild as CityBuildObject, PlayerAction } from '../../types';
import Action from './Action.js';
import Portal from '../Portal.js';
export declare class CityBuild extends Action {
  #private;
  constructor(action: PlayerAction, portal: Portal);
  activate(): void;
  build(): void;
  value(): CityBuildObject;
}
export default CityBuild;
