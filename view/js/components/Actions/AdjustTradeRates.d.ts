import { PlayerTradeRates } from '../../types';
import Action from './Action.js';
export declare class AdjustTradeRates extends Action {
  #private;
  activate(): void;
  build(): void;
  value(): PlayerTradeRates;
}
export default AdjustTradeRates;
