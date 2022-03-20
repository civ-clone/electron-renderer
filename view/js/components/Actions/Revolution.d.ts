import Action from './Action.js';
import { PlayerGovernment } from '../../types';
export declare class Revolution extends Action {
  activate(): void;
  build(): void;
  value(): PlayerGovernment;
}
export default Revolution;
