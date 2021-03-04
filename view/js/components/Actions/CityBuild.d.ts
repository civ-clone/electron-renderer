import Action from './Action.js';
import { CityBuild as CityBuildObject } from '../../types';
export declare class CityBuild extends Action {
  build(): void;
  value(): CityBuildObject;
}
export default CityBuild;
