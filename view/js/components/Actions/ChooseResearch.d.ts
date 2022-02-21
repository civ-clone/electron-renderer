import Action from './Action.js';
import { PlayerResearch } from '../../types';
export declare class ChooseResearch extends Action {
  activate(): void;
  build(): void;
  value(): PlayerResearch;
}
export default ChooseResearch;
