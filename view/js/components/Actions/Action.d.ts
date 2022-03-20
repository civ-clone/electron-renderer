import {
  CityBuild,
  PlayerAction,
  PlayerGovernment,
  PlayerResearch,
  PlayerTradeRates,
  Unit,
} from '../../types';
declare global {
  interface GlobalEventHandlersEventMap {
    actioned: CustomEvent<Action>;
  }
}
export interface IAction {
  activate(): void;
  build(): void;
  complete(): void;
  element(): HTMLElement;
  value():
    | CityBuild
    | PlayerResearch
    | Unit
    | PlayerGovernment
    | PlayerTradeRates;
}
export declare class Action implements IAction {
  #private;
  constructor(action: PlayerAction);
  activate(): void;
  build(): void;
  complete(): void;
  element(): HTMLElement;
  value():
    | CityBuild
    | PlayerResearch
    | Unit
    | PlayerGovernment
    | PlayerTradeRates;
}
export default Action;
