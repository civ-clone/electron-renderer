import { CityBuild as CityBuildObject } from '../../types';
import Action from './Action.js';
export declare class CityBuild extends Action {
  activate(): void;
  build(): void;
  value(): CityBuildObject;
}
export default CityBuild;
