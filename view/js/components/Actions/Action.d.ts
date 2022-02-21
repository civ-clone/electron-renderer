import { CityBuild, PlayerAction, PlayerResearch, Unit } from '../../types';
export interface IAction {
  activate(): void;
  build(): void;
  complete(): void;
  element(): HTMLElement;
  value(): CityBuild | PlayerResearch | Unit;
}
export declare class Action implements IAction {
  #private;
  constructor(action: PlayerAction);
  activate(): void;
  build(): void;
  complete(): void;
  element(): HTMLElement;
  value(): CityBuild | PlayerResearch | Unit;
}
export default Action;
